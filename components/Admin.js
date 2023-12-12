import { useEffect, useState } from 'react';
import styles from '../styles/Admin.module.css';
import { Table, Modal, Switch } from 'antd';


function Admin() {
    const [userData, setUserData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [editedUsername, setEditedUsername] = useState("");

    const columns = [  // Schema du tableau
    {
      title: 'Username',
      width: 120,
      dataIndex: 'username',
    },
    {
        title: 'Email',
        width: 120,
        dataIndex: 'email',
      },
    {
      title: 'Admin',
      width: 120,
      dataIndex: 'isAdmin',
    },
    {
      title: 'Edit',
      dataIndex: 'edit',
      width: 120,
      render: (_, user) => <a className={styles.editButton} onClick={() => openModal(user)}>EDIT</a>,
    },
  ];


    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:3000/users/allUser');
            const data = await response.json();

            const formattedData = data.data.map((user) => ({
                key: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin.toString(),
            }));    
            setUserData(formattedData);

          } catch (error) {
            console.error('Erreur lors du fetch des données : ', error);
          }
        }; 
    
        fetchData();
      }, []);

      
    const openModal = (userData) => {
        setSelectedUser(userData);
        setIsModalOpen(true);
        console.log(userData.username)
    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    const handleSwitchChange = () => {
        const onChange = (checked) => {
            console.log(`switch to ${checked}`);
        };
    }


    const handleSaveButton = () => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/users/updateAdmin', {
                    method: 'PUT',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({token: 'qfLgzLRkR1ecjqvwAaPJqOAFa9xupCFh'}),
                });
                const data = await response.json();

                console.log(data)
    
                // const formattedData = data.data.map((user) => ({
                //     key: user._id,
                //     username: user.username,
                //     email: user.email,
                //     isAdmin: user.isAdmin.toString(),
                // }));    
                // setUserData(formattedData);
    
              } catch (error) {
                console.error('Erreur lors du fetch des données : ', error);
              }
        }
        fetchData();
    };


    return (
        <div>
            <main className={styles.main}>
                <h1 className={styles.title}>Page Administrateur</h1>
                <div className={styles.tableContainer}>
                    <Table dataSource={userData} columns={columns} pagination={false} style={{ overflow: 'auto', maxHeight: '100%' }}/>
                </div>
                {isModalOpen && (
                    <Modal title="User Information" open={isModalOpen} onCancel={closeModal} footer={[
                      <button key="save" onClick={() => handleSaveButton()}>
                        Save
                      </button>,
                    ]}
                  >
                    <p> Username <input onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })} value={selectedUser.username} /> </p>
                    <p>Email <input onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} value={selectedUser.email} /> </p>
                    <p>isAdmin <Switch defaultChecked onChange={handleSwitchChange} size='small' /> </p>
                  </Modal>
                )}
            </main>
        </div>
    );
}

export default Admin;
