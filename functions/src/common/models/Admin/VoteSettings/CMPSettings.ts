import * as admin from "firebase-admin";
type CMPtype = {
    name : string;
    weight : number;
    givenCMP : number;
    share : number;
    index:number;
    color:string;
}

export const createCMP = async (req:any,res:any)=>{
    const {name,weight,givenCMP,share,index,color} = req.body;
    try {
        const cmpSetting : CMPtype= {
            name,
            weight,
            givenCMP,
            share,
            index,
            color
        };
        
        const getDataQueryRef = await admin.firestore().collection("settings").doc("userTypes").get();
        const getData :any = getDataQueryRef.data();
        
        const checkData = getData.userTypes.find((data:any)=>{
            return data.name == name;
        });

        if(checkData){
            return res.status(401).send({
                status: false,
                message: "Already exist.",
                result: null,
              });
        };
       
        //add data into database
        await admin.firestore().collection("settings").doc("userTypes").update('userTypes', admin.firestore.FieldValue.arrayUnion(cmpSetting))

        const newCmpData = getData.userTypes.find((data:any)=>{
            return data.name == name
        });

        if(!newCmpData){
            return res.status(404).send({
                status: false,
                message: "UserType is not found.",
                result: null,
              });
        };
        res.status(200).send({
            status: true,
            message: "UserType created successfully. ",
            result: newCmpData,
          });

    } catch (error) {
        errorLogging("createCMP", "ERROR", error);
        res.status(500).send({
          status: false,
          message: "Something went wrong in server",
          result: error,
        });
    }
}

export const getAllUserTypes =async (req:any,res:any)=>{
    try {
        const getDataQueryRef = await admin.firestore().collection("settings").doc("userTypes").get();
        const getDataData :any = getDataQueryRef.data();

        res.status(200).send({
            status: true,
            message: "UserType created successfully. ",
            result: getDataData,
          });
    } catch (error) {
        errorLogging("createCMP", "ERROR", error);
        res.status(500).send({
          status: false,
          message: "Something went wrong in server",
          result: error,
        });
    }
}

export const updateUserTypes = async (req:any,res:any) =>{
try {
    
    const { name,
        weight,
        givenCMP,
        share,
        index,
        color} = req.body

        const updateValue = {
            name,
            weight,
            givenCMP,
            share,
            index,
            color: color ? color : ' '
        }
        const queryRef = await admin.firestore().collection("settings").doc("userTypes").get();
        const queryRefData :any= queryRef.data();
        const newCmpData = queryRefData.userTypes.find((data:any)=>{
            return data.name == name
        });

        console.log("UPDATE VALUE ==>", updateValue)
    
        await admin.firestore().collection("settings").doc("userTypes").update('userTypes', admin.firestore.FieldValue.arrayRemove(newCmpData))
        await admin.firestore().collection("settings").doc("userTypes").update('userTypes', admin.firestore.FieldValue.arrayUnion(updateValue))
        // const query = await admin.firestore().collection("settings").doc("userTypes").get();
        // const queryData :any= query.data();

        // const data = queryData.userTypes.find((user:any)=>{
        //     return user.name == name
        // })

res.send("DONE")


} catch (error) {
    errorLogging("createCMP", "ERROR", error);
        res.status(500).send({
          status: false,
          message: "Something went wrong in server",
          result: error,
        });
}
}

export const removeUserType = async (req:any,res:any)=>{
    try {
        const {name} = req.body;
        const getDataQueryRef = await admin.firestore().collection("settings").doc("userTypes").get();
        const getDataData :any = getDataQueryRef.data();
        const getData =getDataData.userTypes.find((data:any)=>{
             return data.name == name
        })
        // const getDataQueryRef = await admin.firestore().collection("settings").doc("userTypes").get();
        console.log("admin.firestore.FieldValue.arrayRemove(name) >>>>",admin.firestore.FieldValue.arrayRemove(name))
        const query = await admin.firestore().collection("settings").doc("userTypes").update('userTypes', admin.firestore.FieldValue.arrayRemove(name) )


        
        res.send({query,getData})
        
    } catch (error) {
        errorLogging("createCMP", "ERROR", error);
        res.status(500).send({
          status: false,
          message: "Something went wrong in server",
          result: error,
        });
    }
}

const errorLogging = async (
    funcName: string,
    type: string,
    error: any
  ) => {
    console.info(funcName, type, error);
  };