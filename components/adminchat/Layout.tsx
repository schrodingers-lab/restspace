import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { addChat, deleteChat } from '../../store/chat';
import TrashIcon from './TrashIcon';

export default function Layout(props) {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const goToDashboard = () => {
    console.log("goToDashboard");
    router.push('/admin/dashboard')
  }

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }

  const newChat = async () => {
    const slug = prompt('Please enter your name')
    if (slug) {
      addChat(slugify(slug), user.id, true, true, null, null, supabase)
    }
  }

  return (
    <main className="main flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <nav
        className="w-64 bg-gray-900 text-gray-100 overflow-scroll "
        style={{ maxWidth: '20%', minWidth: 150, maxHeight: '100vh' }}
      >
        <div className="p-2 ">
          <div className="p-2">
            <button
              className="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded w-full transition duration-150"
              onClick={() => goToDashboard()}
              >
                Dashboard
            </button>
          </div>
          <hr className="m-2" />
          <div className="p-2 flex flex-col space-y-2">
            <h6 className="text-xs">{user?.email}</h6>
            <button
              className="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded w-full transition duration-150"

              onClick={() => newChat()}
            >
              New Public Chat
            </button>
          </div>
          <hr className="m-2" />
          <h4 className="font-bold">Chats</h4>
          <ul className="chat-list">
            {props.chats.map((x) => (
              <SidebarItem
                chat={x}
                key={x.id}
                isActiveChat={x.id === props.activeChatId}
                user={user}
                supabase={supabase}
              />
            ))}
          </ul>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 bg-gray-800 h-screen">{props.children}</div>
    </main>
  )
}

const SidebarItem = ({ chat, isActiveChat, user, supabase }) => (
  <>
    <li className="flex items-center justify-between">
      <Link href="/admin/chats/[id]" as={`/admin/chats/${chat.id}`} className={isActiveChat ? 'font-bold' : ''}>
        {chat.slug}
      </Link>
      {/* {chat.id !== 1 && (chat.created_by === user?.id || userRoles.includes('admin')) && (
        <button onClick={() => deleteChat(chat.id)}></button> */}
      {chat.id !== 1 && (
        <button onClick={() => deleteChat(chat.id, supabase)}>
          <TrashIcon />
        </button>
      )}
    </li>
  </>
)