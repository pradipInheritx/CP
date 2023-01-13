import { Button, Figure, Form, Image as Img } from "react-bootstrap";
import React, { useContext } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import User, { UserProps } from "../../common/models/User";
import UserContext from "../../Contexts/User";

type AvatarInputProps = {
  onSubmit: (newUserInfo: UserProps) => Promise<void>;
};
const storage = getStorage();

const AvatarInput = ({ onSubmit }: AvatarInputProps) => {
  const { userInfo, user: u, setUserInfo } = useContext(UserContext);
  const user = userInfo ? new User({ user: userInfo }) : ({} as User);

  const onChangeAvatar = async (
    e?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const input = e?.target as HTMLInputElement;
    const file = input?.files && input.files[0];
    if (file) {
      const storageRef = ref(storage, u?.uid + ".jpg");
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const newUserInfo = { ...userInfo, avatar: url } as UserProps;
      newUserInfo && setUserInfo(newUserInfo);
      await onSubmit(newUserInfo);
    } else {
      const newUserInfo = { ...userInfo, avatar: "" } as UserProps;
      newUserInfo && setUserInfo(newUserInfo);
      await onSubmit(newUserInfo);
    }
  };

  return (
    <>
      {user.avatar && (
        <div className="d-flex flex-column">
          <Form.Group controlId="avatar" className="mb-3">
            <Form.Label as="div">Avatar</Form.Label>
            <Figure
              as="div"
              className="shadow-sm p-3 bg-white rounded mb-2 d-flex"
            >
              <Img thumbnail src={user.avatar} fluid />
            </Figure>
            <Button
              variant="secondary"
              onClick={async () => {
                await onChangeAvatar();
              }}
            >
              Change avatar
            </Button>
          </Form.Group>
        </div>
      )}
      {!user.avatar && (
        <>
          <Form.Group controlId="avatar" className="mb-3">
            <Form.Label as="div">Avatar</Form.Label>
            <Figure className="shadow-sm p-3 bg-white rounded mb-2 d-flex">
              <div style={{ height: 300, width: "100%" }} />
            </Figure>
            <Form.Control
              type="file"
              name="avatar"
              onChange={(e) => onChangeAvatar(e)}
              accept="image/*"
            />
          </Form.Group>
        </>
      )}
    </>
  );
};

export default AvatarInput;
