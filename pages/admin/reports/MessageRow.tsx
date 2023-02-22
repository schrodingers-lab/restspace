import { useEffect, useState } from "react";

export const MessageRow = ({report, completeReport, supabase}) => {

    const [chat, setChat] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const handleAsync = async () => {

            let messageResult = await supabase.from('messages').select(`*`).eq('id',report.object_id).single();
            setMessage(messageResult.data);

            let chatResult = await supabase.from('chats').select(`*`).eq('id', messageResult.data?.chat_id).single();
            setChat(chatResult.data);
        }
        handleAsync();
    }, [report]);

    const viewReportObject = (report) => {
        if (chat){
            window.open(`/admin/chats/${chat?.id}`, "_blank");        
        }
      }

    return (
        <>
            <tr key={report?.id}>
                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                    {report?.id}

                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                    {report?.reason}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                    {report?.mode}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                    <a href={`/admin/users/${report?.user_id}`} target="blank" className="text-indigo-600 hover:text-indigo-900 px-2">{report?.user_id} </a>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                    {report?.created_at}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                    Chat: #{chat?.id} - {chat?.slug} <br/>
                    Message:  #{report?.object_id} - {message?.text}
                </td>
                <td className="py-4 pl-3 px-1pr-4 text-right text-sm font-medium sm:pr-6">
                    <a onClick={() => { completeReport(report); } } className="text-indigo-600 hover:text-indigo-900 px-2">
                        Complete
                    </a>
                    <a onClick={() => { viewReportObject(report); } } className="text-indigo-600 hover:text-indigo-900  px-2">
                        View
                    </a>
                </td>
            </tr>
        </>
        )
}

export default MessageRow;