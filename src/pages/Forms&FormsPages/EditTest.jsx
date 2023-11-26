import React, { useEffect, useState } from "react";

import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { FaPencil, FaTrashCan } from "react-icons/fa6";
import { PiExamFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import uniqid from "uniqid";

import { Button, Input } from "@mui/joy";
import { Autocomplete, TextField } from "@mui/material";

import translations from "../../assets/translations/BookPageTranslations.json";
import formTranslations from "../../assets/translations/FormsTranslations.json";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFormRealData } from "../../hooks/useFormRealData";
import { useRealDatabase } from "../../hooks/useRealDatabase";
import useRealtimeDocuments from "../../hooks/useRealtimeDocuments";

const alphabet = require("alphabet");

function EditTest() {
  const { testId } = useParams();
  const { user } = useAuthContext();
  const { getDocuments } = useRealtimeDocuments();
  const { updateDatabase, addToDataBase } = useRealDatabase();
  const { document } = useFormRealData("tests", testId);
  const [books, setBooks] = useState([]);
  const [data, setData] = useState(null);
  const [refersToBook, setRefersToBook] = useState(null);
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadBooks = async () => {
    const booksEls = await getDocuments("books");

    if (booksEls) {
      setBooks(booksEls);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadData = async () => {
    if (document) {
      setData(document);
    }
  };
  useEffect(() => {
    loadBooks();
    loadData();
  }, [loadBooks, loadData]);

  const [newQuery, setNewQuery] = useState({
    question: "",
    correctAnswer: null,
    possibleAnswers: [
      { label: 1, answer: "", id: uniqid("question1") },
      { label: 2, answer: "", id: uniqid("question2") },
    ],
    queryId: uniqid(`${uniqid(`query`)}`),
  });

  const [createNewQuery, setCreateNewQuery] = useState(false);

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  const setSelectedBook = (e, value) => {
    setRefersToBook(value);
  };

  const removeQuestion = (id) => {
    setData((data) => {
      data.queries = Object.values(data.queries).filter(
        (q) => q.queryId !== id
      );
      return data;
    });
  };

  const enableCreating = () => {
    setCreateNewQuery(!createNewQuery);
  };

  const updateTest = () => {
    updateDatabase(data, "tests", testId);

    Object.values(data.queries).map((query, i) =>
      query.possibleAnswers.map((answer) =>
        updateDatabase(
          {
            ...answer,
            queryId: query.queryId,
          },
          "tests",
          `${testId}/answers/${query.queryId}/${answer.label}`
        )
      )
    );

    navigate(`/test/${testId}`);
  };

  return (
    <div className="min-h-screen h-full">
      {data && (
        <div className="w-full border-b-2 border-accColor p-2">
          <h1 className="text-2xl text-center text-white font-bold p-2">
            {formTranslations.topText.tests[selectedLanguage]}
          </h1>

          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-2">
              <label className="flex flex-col">
                <span>
                  {formTranslations.testFields.testName.label[selectedLanguage]}
                </span>
                <Input
                  className="bg-transparent max-w-md border-accColor text-white"
                  color="primary"
                  size="md"
                  variant="outlined"
                  value={data.testName}
                  placeholder={
                    formTranslations.testFields.testName.placeholder[
                      selectedLanguage
                    ]
                  }
                />
              </label>
              {books.length > 0 && (
                <Autocomplete
                  className="max-w-sm text-white"
                  options={books}
                  value={data.refersToBook.title}
                  isOptionEqualToValue={(option, value) => {
                    option = {};
                    value = {};
                  }}
                  getOptionLabel={(option) => option.title}
                  onChange={setSelectedBook}
                  renderInput={(params) => (
                    <TextField
                      className="max-w-sm text-white"
                      {...params}
                      label={
                        formTranslations.testFields.bookSelection[
                          selectedLanguage
                        ]
                      }
                      variant="outlined"
                    />
                  )}
                  placeholder="Select a book..."
                />
              )}

              <div className="flex gap-2">
                <Button onClick={enableCreating} startDecorator={<FaPlus />}>
                  {
                    formTranslations.testFields.buttonText.addNewQuery[
                      selectedLanguage
                    ]
                  }
                </Button>
                {Object.values(data.queries).length > 1 && (
                  <Button endDecorator={<PiExamFill />} onClick={updateTest}>
                    {formTranslations.updateBtn[selectedLanguage]}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {data && (
        <div className="flex flex-col">
          {createNewQuery && (
            <form>
              <label htmlFor="">
                <span>
                  {formTranslations.testFields.questionLabel[selectedLanguage]}
                </span>
                <Input
                  className="bg-transparent max-w-xs border-accColor text-white"
                  color="primary"
                  size="md"
                  variant="outlined"
                  value={newQuery.question}
                  onChange={(e) => {
                    setNewQuery((query) => {
                      query.question = e.target.value;
                      return query;
                    });
                  }}
                />
              </label>

              <div className="p-2">
                <p>
                  {
                    formTranslations.testFields.possibleAnswers[
                      selectedLanguage
                    ]
                  }
                  :
                </p>
                <div className="flex gap-4 max-w-6xl flex-wrap">
                  {newQuery.possibleAnswers.map((posAnswer) => (
                    <div
                      className={`sm:w-80 cursor-pointer py-2 px-4 rounded-lg flex gap-2 items-center ${
                        newQuery.correctAnswer === posAnswer.id
                          ? "bg-green-500"
                          : "bg-accColor"
                      }`}
                      onClick={() => {
                        if (!newQuery.correctAnswer) {
                          setNewQuery((query) => {
                            query.correctAnswer = posAnswer.id;
                            return query;
                          });
                          return;
                        }
                        if (newQuery.correctAnswer === posAnswer.id) {
                          setNewQuery((query) => {
                            query.correctAnswer = null;
                            return query;
                          });
                          return;
                        }

                        if (newQuery.correctAnswer) {
                          setNewQuery((query) => {
                            query.correctAnswer = posAnswer.id;
                            return query;
                          });
                        }
                      }}
                    >
                      <p className="text-white">
                        {alphabet.lower[posAnswer.label - 1]}
                      </p>
                      <Input
                        className="w-full"
                        key={posAnswer.id}
                        value={posAnswer.answer}
                        onChange={(e) => {
                          setNewQuery((query) => {
                            query.possibleAnswers.find(
                              (answer) => answer.label === posAnswer.label
                            ).answer = e.target.value;
                            return query;
                          });
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();

                          setNewQuery((query) => {
                            // Filter out the selected possible answer
                            query.possibleAnswers =
                              query.possibleAnswers.filter(
                                (q) => q.label !== posAnswer.label
                              );

                            // Recompute label numbers
                            query.possibleAnswers = query.possibleAnswers.map(
                              (q, index) => ({
                                ...q,
                                label: index + 1,
                              })
                            );

                            return query;
                          });
                        }}
                      >
                        <FaTrashAlt className="text-red-500 text-lg" />
                      </button>
                    </div>
                  ))}
                  <Button
                    onClick={() => {
                      setNewQuery((query) => {
                        const newPossibleAnswers = [
                          ...query.possibleAnswers,
                          {
                            label: query.possibleAnswers.length + 1,
                            answer: "",
                            id: uniqid(
                              `answer${query.possibleAnswers.length + 1}`
                            ),
                          },
                        ];
                        return {
                          ...query,
                          possibleAnswers: newPossibleAnswers,
                        };
                      });
                    }}
                  >
                    {
                      formTranslations.testFields.buttonText.anotherQuestion[
                        selectedLanguage
                      ]
                    }
                  </Button>
                </div>
              </div>
              <button
                className="btn btn-wide text-white bg-accColor mt-6 mx-2"
                onClick={(e) => {
                  e.preventDefault(); // Prevent the default form submission behavior

                  if (
                    newQuery.possibleAnswers.filter(
                      (answer) => answer.answer.trim() === ""
                    ).length > 0
                  ) {
                    return;
                  }

                  if (!newQuery.correctAnswer) {
                    return;
                  }

                  if (newQuery.question.trim() === "") {
                    return;
                  }
                  setData((data) => {
                    data.queries = [...Object.values(data.queries), newQuery];
                    return data;
                  });
                  if (
                    Object.values(data.queries).find(
                      (q) => q.queryId === newQuery.queryId
                    )
                  ) {
                    let queryExisted = Object.values(data.queries).find(
                      (q) => q.queryId === newQuery.queryId
                    );

                    queryExisted = newQuery;

                    setData((data) => {
                      const newArr = Object.values(data.queries).filter(
                        (q) => q.queryId !== newQuery.queryId
                      );
                      data.queries = [...newArr, queryExisted];
                      return data;
                    });
                    setCreateNewQuery(false);
                    setNewQuery({
                      question: "",
                      correctAnswer: null,
                      possibleAnswers: [
                        { label: 1, answer: "", id: uniqid("answer1") },
                        { label: 2, answer: "", id: uniqid("answer2") },
                      ],
                      queryId: uniqid(
                        `${uniqid(
                          `query${Object.values(data.queries).length}`
                        )}`
                      ),
                    });
                  } else {
                    setCreateNewQuery(false);
                    setNewQuery({
                      question: "",
                      correctAnswer: null,
                      possibleAnswers: [
                        { label: 1, answer: "", id: uniqid("answer1") },
                        { label: 2, answer: "", id: uniqid("answer2") },
                      ],
                      queryId: uniqid(
                        `${uniqid(
                          `query${Object.values(data.queries).length}`
                        )}`
                      ),
                    });
                  }
                }}
              >
                {
                  formTranslations.testFields.buttonText.createBtn[
                    selectedLanguage
                  ]
                }
              </button>
            </form>
          )}
        </div>
      )}

      {data && Object.values(data.queries).length > 0 && (
        <div className="flex gap-2 flex-col p-2 overflow-y-scroll max-h-[37rem] max-w-3xl">
          <p>Queries:</p>
          {Object.values(data.queries).map((query) => (
            <div className="max-w-2xl bg-accColor text-white py-2 px-4">
              <div className="flex w-full justify-between">
                <button
                  className="flex gap-1 items-center"
                  onClick={() => {
                    setNewQuery(query);
                    enableCreating();
                  }}
                >
                  {translations.buttonsTexts.edit[selectedLanguage]}{" "}
                  <FaPencil />
                </button>
                <button
                  className="flex gap-1 items-center"
                  onClick={() => {
                    removeQuestion(query.queryId);
                  }}
                >
                  {translations.buttonsTexts.delete[selectedLanguage]}{" "}
                  <FaTrashCan className="text-red-500" />
                </button>
              </div>
              <p className="py-2">{query.question}</p>
              <ul className="flex flex-wrap sm:flex-col md:flex-row justify-around items-center w-full gap-4">
                {query.possibleAnswers.map((answer) => (
                  <li className="w-2/5">
                    <div className="w-full flex gap-2">
                      <p>{alphabet.lower[answer.label - 1]}.</p>
                      <p>{answer.answer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EditTest;
