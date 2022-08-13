import { IonBadge, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import { useParams } from 'react-router';
import auth from "../services/Authenticate";
import axios from 'axios';
import { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import moment from "moment";

const TokenList: React.FC = () => {
    const [tokenList, setTokenList] = useState<any>([]);

    useEffect(() => {
        getTokensList();
    }, []);

    useIonViewWillEnter(() => {
        getTokensList();
    });

    let today = new Date();
    const currentDate = moment(today).format("DD-MM-YYYY");

    const getTokensList = async () => {
        const response = await axios.get(`http://localhost:5000/tokens`);
        if (response.status === 200) {
            const data = response.data.filter((x: any) => x.userEmail === UserService.getUserId());
            setTokenList(data);
        }
    }

    const clinicToken = tokenList && tokenList.filter((x: any) => x.tokenDate === currentDate);

    const updateToken = async (data: any) => {
        data.tokenNumber = '1';
        const response = await axios.put(`http://localhost:5000/token/${data.id}`, data);
        if (response.status === 200) {
            alert('Success.!');
            getTokensList();
        } else {
            alert('Failed.! try again later');
        }
    }

    const tokenGrid = clinicToken && clinicToken.map((data: any, i: any) => {
        return (
            <IonItem key={i}>
                <IonGrid>
                    <IonRow>
                        <IonCol size="7"><p style={{ "display": "flex", "margin": 0 }}>Token no: &nbsp; <IonBadge slot="start">{i + 1}</IonBadge></p>
                            <p style={{ "display": "flex", "margin": 0 }}>Name: {data.name}</p>
                        </IonCol>
                        <IonCol size="5"><IonButton color="success" size="small" onClick={() => updateToken(data)} disabled={data.tokenNumber === "1"}>IN</IonButton> <IonButton color="warning" size="small">Delay</IonButton></IonCol>
                    </IonRow>
                </IonGrid>
            </IonItem>
        );
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Token List</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Test</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonList>
                    {tokenGrid}
                </IonList>

            </IonContent>
        </IonPage>
    );
};

export default TokenList;
