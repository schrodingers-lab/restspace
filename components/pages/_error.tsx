import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonIcon } from "@ionic/react"
import { notifications } from "ionicons/icons"

const Page = () => {

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Tour</IonTitle>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>

        <div className="h-full w-full bg-air bg-center bg-cover  flex flex-col justify-center content-center ">

                <section
                  className=" mx-auto  max-w-7xl px-4 sm:px-6 lg:px-8"
                  aria-labelledby="contact-heading"
                >
                  <div className="grid grid-cols-1 gap-y-20 ">
                      <div  className="flex flex-col rounded-2xl bg-white shadow-xl">
                        <div className="relative flex-1 px-6 pt-16 pb-8 md:px-8">
                          <div className="top-0 inline-block -translate-y-1/2 transform rounded-xl bg-ww-primary p-5 shadow-lg">
                            <IonIcon icon={notifications} color="light" />
                          </div>
                          <h3 className="text-xl font-medium text-gray-900">Error</h3>
                          <p className="mt-4 text-base text-gray-500">
                                Error occurred
                          </p>
                        </div>
                        <div className="rounded-bl-2xl rounded-br-2xl bg-gray-50 p-6 md:px-8">
                            <button  
                                className="mb-10 bg-gray-50 rounded-xl"
                                onClick={() => window.location.reload()}>
                                Reload App
                            </button>
                        </div>
                      </div>
                  </div>
                </section>
              </div>
              </IonContent>
            </IonPage>
    )
}