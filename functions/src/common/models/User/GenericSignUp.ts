import * as admin from "firebase-admin";
import {
    Colors,
    UserProps,
    UserTypeProps,
} from "../User";


export const signUp = async (req: any, res: any) => {

    const { phoneNumber, displayName, photoURL, email } = req.body;
    const status: UserTypeProps = {
        name: "Member",
        weight: 1,
        index: 7,
        givenCPM: 0,
        minVote: 0,
        share: 0,
        color: Colors.PLATINUM,
    };
    const userData: UserProps = {
        address: "",
        avatar: photoURL,
        country: "",
        email,
        firstName: "",
        lastName: "",
        mfa: false,
        displayName,
        phone: phoneNumber,
        subscribers: [],
        children: [],
        voteStatistics: {
            total: 0,
            successful: 0,
            score: 0,
            rank: 0,
            commission: 0,
            pax: 50,
        },
        rewardStatistics: {
            total: 0,
            claimed: 0,
            cards: [],
            extraVote: 0,
            diamonds: 0,
        },
        favorites: [],
        status,
    };

    try {

        const query = admin
            .firestore()
            .collection("users");

        // add new user query
        const signUpQuery = await query.add(userData);

        //add user id into user documment
        await query
            .doc(signUpQuery.id)
            .set({ uid: signUpQuery.id }, { merge: true });

        // get the user
        const getDataQuery = await query.doc(signUpQuery.id).get();

        const getData = getDataQuery.data()

        return res.status(201).send({
            status: true,
            message: "user added successfully",
            result: getData
        });


    } catch (e) {
        return res.status(500).send({
            status: false,
            message: "Internal Server Error",
            result: null
        });
    }
}