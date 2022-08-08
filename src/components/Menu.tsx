import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  useIonViewWillEnter,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';
import auth from "../services/Authenticate";
import axios from 'axios';
import { Component, useEffect, useState } from 'react';
import TokenList from '../pages/Token-List';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Tocken list',
    url: '/page/token-list',
    iosIcon: mailOutline,
    mdIcon: mailSharp,
  },
  {
    title: 'Profile',
    url: '/page/profile',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp
  },
];

const Menu: React.FC = () => {
  const [userName, setUserName] = useState(undefined);
  const [userEmail, setUserEmail] = useState(undefined);
  const [userFirstName, setUserFirstName] = useState(undefined);
  const [userLastName, setUserLastName] = useState(undefined);

  useEffect(() => {
    auth.keycloak().then(([userTokenObject]) => {
      setUserName(userTokenObject.getUsername());
      setUserEmail(userTokenObject.getUserId());
      setUserFirstName(userTokenObject.getFirstName());
      setUserLastName(userTokenObject.getLastName());
    });
  }, []);

  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Dr. {userFirstName} {userLastName}</IonListHeader>
          <IonNote>{userEmail}</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
