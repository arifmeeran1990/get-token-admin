import React, { useState, useRef, useEffect } from 'react';
import { IonButton, IonContent, IonHeader, IonLabel, IonList, IonListHeader, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar, IonInput, IonItem, IonTextarea, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, useIonViewDidEnter, useIonViewWillEnter, IonButtons, IonMenuButton } from '@ionic/react';
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import auth from "../services/Authenticate";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UserService from '../services/UserService';

type getParams = {
    id: any;
};

const Profile: React.FC = () => {
    const [userName, setUserName] = useState(undefined);
    const [userEmail, setUserEmail] = useState(undefined);
    const [userFirstName, setUserFirstName] = useState(undefined);
    const [userLastName, setUserLastName] = useState(undefined);
    const [selectedImage, setSelectedImage] = useState();
    const [selectedProfileName, setSelectedProfileName] = useState();
    const [profileDataByEmail, setProfileDataByEmail] = useState<any>();
    const { id } = useParams<getParams>();

    let initialValues = {
        id: "",
        clinicName: "",
        email: "",
        department: "",
        address: "",
        fees: "",
        userName: "" || undefined,
        experience: "",
        contactNumber: "",
        photo: "",
        range: ""
    };

    // set the default values for the controls
    const { control, register, handleSubmit, formState, setValue, watch } = useForm({
        defaultValues: initialValues
    });

    useEffect(() => {
        getProfileByID();
    }, []);

    useIonViewWillEnter(() => {
        getProfileByID();
    });

    // const userFullName = userFirstName && userFirstName + ' ' + userLastName;
    const userFullName = UserService.getFirstName() + ' ' + UserService.getLastName();
    const email = UserService.getUserId();

    let getCurrentProfileData;
    const getProfileByID = async () => {
        const response = await axios.get(`http://localhost:5000/profiles`);
        if (response.status === 200) {
            if (response.data) {
                getCurrentProfileData = response.data.find((profile: any) => profile.email === UserService.getUserId());
                setProfileDataByEmail(getCurrentProfileData);
            }
        }
    }

    const userIamge = `./${profileDataByEmail && profileDataByEmail?.photo}`;

    const addProfile = async (data: any) => {
        data.photo = selectedProfileName;
        data.userName = UserService.getUsername();
        data.email = UserService.getUserId();
        const response = await axios.post("http://localhost:5000/profile", data);
        if (response.status === 200) {
            alert('Succesfully saved');
            getProfileByID();
        } else {
            alert('Failed.! try again later');
        }
    }

    const onSubmit = (data: any) => {
        addProfile(data);
    };

    let file: File;

    const onFileChange = (fileChangeEvent: any) => {
        if (fileChangeEvent.target.files && fileChangeEvent.target.files.length > 0) {
            setSelectedImage(fileChangeEvent.target.files[0]);
        }
        file = fileChangeEvent.target.files[0];
        setSelectedProfileName(fileChangeEvent.target.files[0].name);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Profile</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {profileDataByEmail && profileDataByEmail ?
                    <div>
                        <IonCard>
                            <IonCardHeader>
                                <div>
                                    <img
                                        src={userIamge}
                                        alt="Thumb"
                                    />
                                </div>
                                <IonCardSubtitle>{profileDataByEmail?.clinicName}</IonCardSubtitle>
                                <IonCardTitle>Dr. {profileDataByEmail?.userName} {profileDataByEmail?.department}</IonCardTitle>
                            </IonCardHeader>

                            <IonCardContent>
                                {profileDataByEmail?.address}
                                <p><small>Fees: {profileDataByEmail?.fees}</small></p>
                                <p><small>Experience: {profileDataByEmail?.experience} +</small></p>
                                <p><small>Contact number: {profileDataByEmail?.contactNumber}</small></p>
                            </IonCardContent>
                        </IonCard>
                        <p></p>
                        <IonButton color="success" type='submit' shape="round" expand="full">Edit</IonButton>
                    </div>
                    :
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {selectedImage && (
                            <div>
                                <img
                                    src={URL.createObjectURL(selectedImage)}
                                    alt="Thumb"
                                />
                            </div>
                        )}
                        <IonList>
                            <IonItem>
                                <Controller
                                    control={control}
                                    name='photo'
                                    render={({ field }) => (
                                        <input type="file"  {...field} onChange={ev => onFileChange(ev)}></input>
                                    )}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Name *</IonLabel>
                                <Controller
                                    control={control}
                                    name='userName'
                                    render={({ field }) => (
                                        <IonInput value={userFullName} onIonChange={e => { field.onChange(e); }}></IonInput>
                                    )}
                                    // rules={{ required: true }}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Email *</IonLabel>
                                <Controller
                                    control={control}
                                    name='email'
                                    render={({ field }) => (
                                        <IonInput value={email} type='email' onIonChange={e => { field.onChange(e); }}></IonInput>
                                    )}
                                    // rules={{ required: true }}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Contact number *</IonLabel>
                                <Controller
                                    control={control}
                                    name='contactNumber'
                                    render={({ field }) => (
                                        <IonInput placeholder="Enter contact numbet" type='number' {...field} onIonChange={e => { field.onChange(e); }}></IonInput>
                                    )}
                                    // rules={{ required: true }}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Select Department *</IonLabel>
                                <Controller
                                    control={control}
                                    name='department'
                                    render={({ field }) => (
                                        <IonSelect placeholder="Select Department" {...field} onIonChange={e => { field.onChange(e); }}>
                                            <IonSelectOption value="mbbs">MBBS</IonSelectOption>
                                            <IonSelectOption value="mbbs, md">MBBS, MD</IonSelectOption>
                                        </IonSelect>
                                    )}
                                    // rules={{ required: true }}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Experience *</IonLabel>
                                <Controller
                                    control={control}
                                    name='experience'
                                    render={({ field }) => (
                                        <IonInput placeholder="Enter experience" type='number' {...field} onIonChange={e => { field.onChange(e); }}></IonInput>
                                    )}
                                    // rules={{ required: true }}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Fees *</IonLabel>
                                <Controller
                                    control={control}
                                    name='fees'
                                    render={({ field }) => (
                                        <IonInput placeholder="Enter fees" type='number' {...field} onIonChange={e => { field.onChange(e); }}></IonInput>
                                    )}
                                    // rules={{ required: true }}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Clinic Name *</IonLabel>
                                <Controller
                                    control={control}
                                    name='clinicName'
                                    render={({ field }) => (
                                        <IonInput placeholder="Enter clinic name" {...field} onIonChange={e => { field.onChange(e); }}></IonInput>
                                    )}
                                    // rules={{ required: true }}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Address *</IonLabel>
                                <Controller
                                    control={control}
                                    name='address'
                                    render={({ field }) => (
                                        <IonTextarea placeholder="Enter Address" {...field} onIonChange={e => { field.onChange(e); }}></IonTextarea >
                                    )}
                                    // rules={{ required: true }}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Range *</IonLabel>
                                <Controller
                                    control={control}
                                    name='range'
                                    render={({ field }) => (
                                        <IonInput {...field} onIonChange={e => { field.onChange(e); }}></IonInput>
                                    )}
                                    // rules={{ required: true }}
                                />
                            </IonItem>
                        </IonList>
                        <IonButton color="success" type='submit' shape="round" expand="full">Save</IonButton>
                    </form>}
            </IonContent>
        </IonPage>
    );
};

export default Profile;