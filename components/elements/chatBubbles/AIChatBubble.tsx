import { Message, ToolInvocation } from 'ai'
import React from 'react'
import { FaRobot } from 'react-icons/fa6'
import ReactMarkdown from 'react-markdown';

type Props = {message:Message}

function AIChatBubble({ message }: Props) {
    
  

  return (
      <div key={message.id} className={`chat ${message.role === 'assistant' ? 'chat-start' : 'chat-end'}`}>
  <div className="chat-image avatar">
    {message.role==='assistant' ? <FaRobot className='text-white text-3xl'/> : <div className="w-10 rounded-full">
      <img
        alt="Tailwind CSS chat bubble component"
        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
    </div>}
  </div>
  <div className="chat-header">
    {message.name}
  </div>
          <div className="chat-bubble bg-primary-color text-white max-w-2xl h-fit w-fit">
            {message.toolInvocations && message.toolInvocations.length > 0 && (message.toolInvocations as ToolInvocation[])[0].state === 'result' && (message.toolInvocations as ToolInvocation[])[0].result}
              <ReactMarkdown className={'text-sm'}>          
              {message.content}
              
              </ReactMarkdown>
          </div>
</div>
  )
}

export default AIChatBubble