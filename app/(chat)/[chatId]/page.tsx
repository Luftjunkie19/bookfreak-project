import { useRouter } from 'next/router';

function MessagesHolder() {
  const router = useRouter();
  const { chatId } = router.query;

  return (
      <div>
      
      <div className="max-h-12 h-full bg-light-blue-gradient w-full"></div>
    </div>
  );
}

export default MessagesHolder;
