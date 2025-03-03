import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { registerUser, selectError } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    //DONE: логика регистрации
    e.preventDefault();
    const data = {
      email: email,
      name: userName,
      password: password
    };
    dispatch(registerUser(data))
      .unwrap()
      .then(() => {
        navigate('/profile', { replace: true });
      });
  };

  return (
    <RegisterUI
      errorText={useSelector(selectError)}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
