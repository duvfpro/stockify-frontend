import { useEffect, useState } from 'react';
import styles from '../styles/Admin.module.css';
import { Table, Modal, Switch } from 'antd';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';


function Admin() {
    const [userData, setUserData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
    const [refreshData, setRefreshData] = useState(false); // Etat qui sert à recharger le useEffect
    const user = useSelector((state) => state.user.value);
    const router = useRouter();
    // Les états pour créer un new user
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
      if (!user.token) {
        router.push('/');
      }
    }, [user.token, router]);

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
      render: (_, user) => <a className={styles.editButton} onClick={() => openEditModal(user)}>EDIT</a>,
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
      }, [refreshData]);

      
    const openEditModal = (userData) => {
        setSelectedUser(userData);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedUser(null);
        setIsEditModalOpen(false);
    };

    const openNewUserModal = (userData) => {
        setIsNewUserModalOpen(true);
    };

    const closeNewUserModal = () => {
        setIsNewUserModalOpen(false);
    };

    const handleSwitchChange = () => {
        setIsAdmin(!isAdmin);
    };

    const handleEditSwitchChange = () => {
        setSelectedUser({...selectedUser, isAdmin: !isAdmin});
    }


    const handleNewUserSaveButton = () => { 
        fetch('http://localhost:3000/users/addUser', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({username: username, email: email, isAdmin: isAdmin, password: password}),
        })
        .then(response => response.json())
        .then((data) => {
            setRefreshData(!refreshData); // utilisé dans le useEffect pour recharger la liste des users après suppression
            closeNewUserModal();
        });
    };


    const handleDeleteButton = (emailToDelete) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this user ?");
        if (isConfirmed) {
            fetch(`http://localhost:3000/users/${emailToDelete}`, {
                method: 'DELETE',
                headers: {'Content-type': 'application/json'},
            }) 
            .then(response => response.json())
            .then((data) => {
                setRefreshData(!refreshData); // utilisé dans le useEffect pour recharger la liste des users après suppression
                closeEditModal();
            });
        }; 
    };


    const handleEditSaveButton = () => { // A TERMINER CAR ISADMIN NE MARCHE PAS
        
        const fetchUserId = async () => {
            try {
                console.log(selectedUser);
                const response = await fetch(`http://localhost:3000/users/updateUser/${selectedUser.key}`, {
                            method: 'PUT',
                            headers: {'Content-type': 'application/json'},
                            body: JSON.stringify(selectedUser),
                        });
                    const data2 = await response.json();
        
                console.log("2eme fetch " + data2);
                setRefreshData(!refreshData);
                closeEditModal();
            }catch (error) {
                console.error('Erreur lors du fetch des données du user: ', error);
            }
        }
        fetchUserId();
  };


    return (
        <div>
            <main className={styles.main}>
                <h1 className={styles.title}>Page Administrateur</h1>
                <button onClick={() => openNewUserModal()} >
                    ADD NEW USER
                </button>
                {isNewUserModalOpen && (
                    <Modal title="New User" open={isNewUserModalOpen} onCancel={closeNewUserModal} footer={[
                      <button onClick={() => handleNewUserSaveButton()}>
                        Create new User
                      </button>,
                    ]}
                    >
                    <p>Username <input onChange={(e) => setUsername(e.target.value)} value={username} /> </p>
                    <p>Email <input onChange={(e) => setEmail(e.target.value)} value={email} /> </p>
                    <p>Password <input onChange={(e) => setPassword(e.target.value)} value={password} /> </p>
                    <p>Admin <Switch onChange={handleSwitchChange} size='small' /> </p>
                  </Modal>
                )}

                <div className={styles.tableContainer}>
                    <Table dataSource={userData} columns={columns} pagination={false} style={{ overflow: 'auto', maxHeight: '100%' }}/>
                </div>
                {isEditModalOpen && (
                    <Modal title="User Information" open={isEditModalOpen} onCancel={closeEditModal} footer={[
                      <button onClick={() => handleEditSaveButton()}>
                        Save
                      </button>,
                    ]}
                  >
                    <p> Username <input onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })} value={selectedUser.username} /> </p>
                    <p>Email <input onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} value={selectedUser.email} /> </p>
                    <p>Admin <Switch onChange={handleEditSwitchChange} checked={selectedUser.isAdmin} size='small' /> </p>
                    <button onClick={() => handleDeleteButton(selectedUser.email)}>
                        DELETE USER
                    </button>
                  </Modal>
                )}
            </main>
        </div>
    );
}

export default Admin;
