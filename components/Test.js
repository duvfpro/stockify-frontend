import styles from '../styles/Test.module.css';
import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../reducers/users';

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values) => {
        try {
            const response = await fetch('http://localhost:3000/users/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    password: values.password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.result) {
                    dispatch(login(values.username, data.token));
                    if (user.token) {
                        router.push('/home');
                    }
                } else {
                    messageApi.open({
                        type: 'error',
                        content: 'Wrong username or password',
                    });
                    console.error('Sign-in failed:', data.error);
                }
            }
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: 'An unexpected error occurred. Please try again later.',
            });
            console.error('Error during sign-in:', error);
        }
    };

    const handleSubmitFailed = (errorInfo) => {
        console.log('Failed: Bug formulaire', errorInfo);
    };

    return (
        <div className={styles.centeredContainer}>
            <h1>Stockify</h1>
            <Form
                className={styles.loginForm}
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={handleSubmit}
                onFinishFailed={handleSubmitFailed}
                autoComplete="off"
            >
                <Form.Item
                    className={styles.loginFormFormItem}
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    className={styles.loginFormFormItem}
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    className={styles.loginFormButton}
                    wrapperCol={{
                        span: 24,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Sign In
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
