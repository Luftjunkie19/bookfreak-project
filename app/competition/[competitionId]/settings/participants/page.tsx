import Button from 'components/buttons/Button'
import DashboardBar from 'components/Sidebars/left/competition/DashboardBar'
import React from 'react'
import img from '../../../../../assets/Logo.png'
import { FaAnglesDown, FaAnglesUp, FaBan, FaBook, FaCircleUser, FaCodePullRequest, FaUsers } from 'react-icons/fa6'
import { RiContractFill, RiMapPinTimeLine, RiQuestionAnswerFill } from 'react-icons/ri'
import Image from 'next/image'
import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs'
import { FaCheckCircle, FaUsersCog, FaVolumeMute } from 'react-icons/fa'
import { MdCancel } from 'react-icons/md'
import { GiExitDoor, GiRank3 } from 'react-icons/gi'
import { SiPowerpages } from 'react-icons/si'
import { TbAlertTriangleFilled } from 'react-icons/tb'

type Props = {}

function Page({}: Props) {
  return (
    <div className='flex w-full'>
  <DashboardBar/>
      <div className='w-full flex gap-6 sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)]  flex-col overflow-y-auto p-3'>
        <div className="flex flex-col gap-1">
        <p className='text-white text-2xl flex items-center gap-2'><FaCodePullRequest /> Requests/Reports from Participants</p>

          <div className="">

            <div className="flex text-white mx-auto justify-between p-1 items-center min-w-full overflow-x-hidden w-full">
              <p className='flex-1 justify-center flex items-center gap-6 text-center'>User <FaCircleUser className='text-2xl text-primary-color' /></p>
              <p className='flex-1 justify-center flex items-center gap-6 text-center'>Read <FaBook className='text-2xl text-primary-color'/></p>
                       <p className='flex-1 justify-center flex items-center gap-6 text-center'>Conditions <RiContractFill className='text-2xl text-primary-color'/></p>
              <p className='flex-1 justify-center flex items-center gap-6 text-center'>Answers <RiQuestionAnswerFill className='text-2xl text-primary-color' /></p>
                 <p className='flex-1 justify-center flex items-center gap-6 text-center'>Decision <BsThreeDots  className='text-2xl text-primary-color' /></p>
            </div>
            
          <div className="flex flex-col max-h-[32rem] gap-4 w-full bg-dark-gray p-2 rounded mx-auto">

              <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-green-400  flex gap-2 justify-center items-center">Yes</div>
                  <div className="flex-1 overflow-y-auto items-center flex justify-center text-gray-500"><Button type='blue'>Check Answers</Button></div>
                <div className="flex-1 flex gap-1 justify-center items-center">
                                    <Button additionalClasses='text-green-400 text-3xl' type='transparent'><FaCheckCircle/></Button>
                   <Button additionalClasses='text-red-400 text-3xl' type='transparent'><MdCancel /></Button>
                </div>
              </div>
              
                 <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-green-400  flex gap-2 justify-center items-center">Yes</div>
                  <div className="flex-1 overflow-y-auto items-center flex justify-center "><Button type='blue'>Check Answers</Button></div>
                <div className="flex-1 flex gap-1 justify-center items-center">
                                   <Button additionalClasses='text-green-400 text-3xl' type='transparent'><FaCheckCircle/></Button>
                   <Button additionalClasses='text-red-400 text-3xl' type='transparent'><MdCancel /></Button>
                </div>
              </div>

                 <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-green-400  flex gap-2 justify-center items-center">Yes</div>
                  <div className="flex-1 overflow-y-auto items-center flex justify-center "><Button type='blue'>Check Answers</Button></div>
                <div className="flex-1 flex gap-1 justify-center items-center">
                                  <Button additionalClasses='text-green-400 text-3xl' type='transparent'><FaCheckCircle/></Button>
                   <Button additionalClasses='text-red-400 text-3xl' type='transparent'><MdCancel /></Button>
                </div>
              </div>
              
                 <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-green-400  flex gap-2 justify-center items-center">Yes</div>
                  <div className="flex-1 overflow-y-auto items-center flex justify-center "><Button type='blue'>Check Answers</Button></div>
                <div className="flex-1 flex gap-1 justify-center items-center">
                                   <Button additionalClasses='text-green-400 text-3xl' type='transparent'><FaCheckCircle/></Button>
                   <Button additionalClasses='text-red-400 text-3xl' type='transparent'><MdCancel /></Button>
                </div>
              </div>
              
                 <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-green-400  flex gap-2 justify-center items-center">Yes</div>
                  <div className="flex-1 overflow-y-auto items-center flex justify-center "><Button type='blue'>Check Answers</Button></div>
                <div className="flex-1 flex gap-1 justify-center items-center">
                  <Button additionalClasses='text-green-400 text-3xl' type='transparent'><FaCheckCircle/></Button>
                   <Button additionalClasses='text-red-400 text-3xl' type='transparent'><MdCancel /></Button>
                </div>
              </div>

          </div>
          
        </div>
        </div>
        
            <div className="flex flex-col gap-1">
        <p className='text-white text-2xl flex gap-2 items-center'><FaUsersCog /> Administration </p>

          <div className="">

            <div className="flex text-white mx-auto justify-between p-1 items-center min-w-full overflow-x-hidden w-full">
              <p className='flex-1 justify-center flex items-center gap-6 text-center'>User <FaCircleUser className='text-2xl text-primary-color' /></p>
              <p className='flex-1 justify-center flex items-center gap-6 text-center'>Role <FaBook className='text-2xl text-primary-color'/></p>
                       <p className='flex-1 justify-center flex items-center gap-6 text-center'>Entitlements <RiContractFill className='text-2xl text-primary-color'/></p>
                 <p className='flex-1 justify-center flex items-center gap-6 text-center'>Mangement <BsThreeDots  className='text-2xl text-primary-color' /></p>
            </div>
            
          <div className="flex flex-col max-h-[32rem] gap-4 w-full bg-dark-gray p-2 rounded mx-auto">

              <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-green-400  flex gap-2 justify-center items-center">Yes</div>
                 
                <div className="flex-1 flex gap-1 justify-center items-center">
                                    <Button additionalClasses='text-red-400  text-3xl' type='transparent'><GiExitDoor/></Button>
                  <Button additionalClasses='text-green-400 text-3xl' type='transparent'><FaAnglesUp /></Button>
                  <Button additionalClasses='text-red-400 text-3xl' type='transparent'><FaAnglesDown /></Button>
                                     <Button additionalClasses='text-primary-color text-3xl' type='transparent'><BsThreeDotsVertical  /></Button>
                </div>
              </div>
              
                 <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-green-400  flex gap-2 justify-center items-center">Yes</div>
                 
                <div className="flex-1 flex gap-1 justify-center items-center">
                                    <Button additionalClasses='text-red-400  text-3xl' type='transparent'><GiExitDoor/></Button>
                  <Button additionalClasses='text-green-400 text-3xl' type='transparent'><FaAnglesUp /></Button>
                  <Button additionalClasses='text-red-400 text-3xl' type='transparent'><FaAnglesDown /></Button>
                                     <Button additionalClasses='text-primary-color text-3xl' type='transparent'><BsThreeDotsVertical  /></Button>
                </div>
              </div>

                 <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-green-400  flex gap-2 justify-center items-center">Yes</div>
                 
                <div className="flex-1 flex gap-1 justify-center items-center">
                               <Button additionalClasses='text-red-400  text-3xl' type='transparent'><GiExitDoor/></Button>
                  <Button additionalClasses='text-green-400 text-3xl' type='transparent'><FaAnglesUp /></Button>
                  <Button additionalClasses='text-red-400 text-3xl' type='transparent'><FaAnglesDown /></Button>
                                     <Button additionalClasses='text-primary-color text-3xl' type='transparent'><BsThreeDotsVertical  /></Button>
                </div>
              </div>
              
                 <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-green-400  flex gap-2 justify-center items-center">Yes</div>
                 
                <div className="flex-1 flex gap-1 justify-center items-center">
  <Button additionalClasses='text-red-400  text-3xl' type='transparent'><GiExitDoor/></Button>
                  <Button additionalClasses='text-green-400 text-3xl' type='transparent'><FaAnglesUp /></Button>
                  <Button additionalClasses='text-red-400 text-3xl' type='transparent'><FaAnglesDown /></Button>
                                     <Button additionalClasses='text-primary-color text-3xl' type='transparent'><BsThreeDotsVertical  /></Button>
                </div>
              </div>
              
                 <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-green-400  flex gap-2 justify-center items-center">Yes</div>
                 
                <div className="flex-1 flex gap-1 justify-center items-center">
                 <Button additionalClasses='text-red-400  text-3xl' type='transparent'><GiExitDoor/></Button>
                  <Button additionalClasses='text-green-400 text-3xl' type='transparent'><FaAnglesUp /></Button>
                  <Button additionalClasses='text-red-400 text-3xl' type='transparent'><FaAnglesDown /></Button>
                                     <Button additionalClasses='text-primary-color text-3xl' type='transparent'><BsThreeDotsVertical  /></Button>
                </div>
              </div>

          </div>
          
        </div>
        </div>
        
            <div className="flex flex-col gap-1">
        <p className='text-white text-2xl flex gap-2 items-center'><FaUsers /> Competition's Participants</p>

          <div className="">

            <div className="flex text-white mx-auto justify-between p-1 items-center min-w-full overflow-x-hidden w-full">
              <p className='flex-1 justify-center flex items-center gap-6 text-center'>User <FaCircleUser className='text-2xl text-primary-color' /></p>
              <p className='flex-1 justify-center flex items-center gap-6 text-center'>Read <FaBook className='text-2xl text-primary-color'/></p>
                 <p className='flex-1 justify-center flex items-center gap-6 text-center'>Read Pages <SiPowerpages  className='text-2xl text-primary-color'/></p>
              <p className='flex-1 justify-center flex items-center gap-6 text-center'>Rank <GiRank3 className='text-2xl text-primary-color' /></p>
                 <p className='flex-1 justify-center flex items-center gap-6 text-center'>Joined in <RiMapPinTimeLine className='text-2xl text-primary-color'/></p>
                 <p className='flex-1 justify-center flex items-center gap-6 text-center'>Decision <BsThreeDots  className='text-2xl text-primary-color' /></p>
            </div>
            
          <div className="flex flex-col max-h-[32rem] gap-4 w-full bg-dark-gray p-2 rounded mx-auto">

              <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-primary-color  flex gap-2 justify-center items-center">#12</div>
                  <div className="flex-1 text-gray-500 overflow-y-auto items-center flex justify-center ">20.10.2024</div>
                <div className="flex-1 flex gap-1 justify-center items-center">
                  <Button additionalClasses='text-green-400 text-xl' type='transparent'><FaCheckCircle /></Button>
                  <Button additionalClasses='text-yellow-500 text-xl' type='transparent'><TbAlertTriangleFilled /></Button>
                   <Button additionalClasses='text-orange-500 text-xl' type='transparent'><FaVolumeMute /></Button>
                   <Button additionalClasses='text-red-400 text-xl' type='transparent'><FaBan  /></Button>
                </div>
              </div>
               <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-primary-color  flex gap-2 justify-center items-center">#12</div>
                  <div className="flex-1 overflow-y-auto items-center flex justify-center text-gray-500 ">20.10.2024</div>
                <div className="flex-1 flex gap-1 justify-center items-center">
                  <Button additionalClasses='text-green-400 text-xl' type='transparent'><FaCheckCircle /></Button>
                  <Button additionalClasses='text-yellow-500 text-xl' type='transparent'><TbAlertTriangleFilled /></Button>
                   <Button additionalClasses='text-orange-500 text-xl' type='transparent'><FaVolumeMute /></Button>
                   <Button additionalClasses='text-red-400 text-xl' type='transparent'><FaBan  /></Button>
                </div>
              </div>
               <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-primary-color  flex gap-2 justify-center items-center">#12</div>
                  <div className="flex-1 overflow-y-auto items-center flex justify-center text-gray-500">20.10.2024</div>
                <div className="flex-1 flex gap-1 justify-center items-center">
                  <Button additionalClasses='text-green-400 text-xl' type='transparent'><FaCheckCircle /></Button>
                  <Button additionalClasses='text-yellow-500 text-xl' type='transparent'><TbAlertTriangleFilled /></Button>
                   <Button additionalClasses='text-orange-500 text-xl' type='transparent'><FaVolumeMute /></Button>
                   <Button additionalClasses='text-red-400 text-xl' type='transparent'><FaBan  /></Button>
                </div>
              </div>
               <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-primary-color  flex gap-2 justify-center items-center">#12</div>
                  <div className="flex-1 overflow-y-auto items-center flex justify-center text-gray-500">20.10.2024</div>
                <div className="flex-1 flex gap-1 justify-center items-center">
                  <Button additionalClasses='text-green-400 text-xl' type='transparent'><FaCheckCircle /></Button>
                  <Button additionalClasses='text-yellow-500 text-xl' type='transparent'><TbAlertTriangleFilled /></Button>
                   <Button additionalClasses='text-orange-500 text-xl' type='transparent'><FaVolumeMute /></Button>
                   <Button additionalClasses='text-red-400 text-xl' type='transparent'><FaBan  /></Button>
                </div>
              </div>
               <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-primary-color  flex gap-2 justify-center items-center">#12</div>
                  <div className="flex-1 overflow-y-auto items-center flex justify-center text-gray-500">20.10.2024</div>
                <div className="flex-1 flex gap-1 justify-center items-center">
                  <Button additionalClasses='text-green-400 text-xl' type='transparent'><FaCheckCircle /></Button>
                  <Button additionalClasses='text-yellow-500 text-xl' type='transparent'><TbAlertTriangleFilled /></Button>
                   <Button additionalClasses='text-orange-500 text-xl' type='transparent'><FaVolumeMute /></Button>
                   <Button additionalClasses='text-red-400 text-xl' type='transparent'><FaBan  /></Button>
                </div>
              </div>
               <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-primary-color  flex gap-2 justify-center items-center">#12</div>
                  <div className="flex-1 overflow-y-auto items-center flex justify-center text-gray-500">20.10.2024</div>
                <div className="flex-1 flex gap-1 justify-center items-center">
                  <Button additionalClasses='text-green-400 text-xl' type='transparent'><FaCheckCircle /></Button>
                  <Button additionalClasses='text-yellow-500 text-xl' type='transparent'><TbAlertTriangleFilled /></Button>
                   <Button additionalClasses='text-orange-500 text-xl' type='transparent'><FaVolumeMute /></Button>
                   <Button additionalClasses='text-red-400 text-xl' type='transparent'><FaBan  /></Button>
                </div>
              </div>
              
              
             
              
              
              
                

          </div>
          
        </div>
          </div>

      
        
</div>
  </div>
  )
}

export default Page