import { IonIcon } from "@ionic/react"
import { alertCircle, logOut } from "ionicons/icons"


export const ErrorCard  = ({errorMessage}) => {

  return (
    <div className="rounded-md bg-red-700 p-4 w-full">
      <div className="flex">
        <div className="flex-shrink-0">
             <IonIcon icon={alertCircle} color="white" />
        </div>
        <div className="ml-3">
          {/* <h3 className="text-sm font-medium text-red-800">There were 2 errors with your submission</h3> */}
          <div className="text-sm text-red-50">{errorMessage}
            {/* <ul role="list" className="list-disc space-y-1 pl-5">
              <li >{errorMessage}</li>
            </ul> */}
          </div>
        </div>
      </div>
    </div>
  )
}
