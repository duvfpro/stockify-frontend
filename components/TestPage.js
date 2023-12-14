import React, { useEffect, useState } from 'react';
import { Avatar, List, Button, Modal, Input, Switch } from 'antd';
import styles from '../styles/Test.module.css';

const TestPage = () => {
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedUsername, setEditedUsername] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedIsAdmin, setEditedIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/users/allUser');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
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

  const handleEditClick = (key) => {
    const userToEdit = userData.find((user) => user.key === key);
    setSelectedUser(userToEdit);
    setEditedUsername(userToEdit.username);
    setEditedEmail(userToEdit.email);
    setEditedIsAdmin(userToEdit.isAdmin === 'true');
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/updateUser/${selectedUser.key}`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          isAdmin: editedIsAdmin,
          username: editedUsername,
          email: editedEmail,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
  
        setRefreshData(!refreshData);
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du user: ', error);
    } finally {
      setModalVisible(false);
    }
  };
  return (
    <div className={styles.container}>
      <List
        dataSource={userData}
        pagination={{
          position: 'bottom',
          align: 'center',
        }}
        renderItem={(item) => (
          <List.Item className={styles.listItem}>
            <List.Item.Meta
              avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${item.key}`} />}
              title={`${item.username}`}
              description={`Email: ${item.email}, isAdmin: ${item.isAdmin}`}
            />
            <Button type="primary" onClick={() => handleEditClick(item.key)}>
              Edit
            </Button>
          </List.Item>
        )}
      />

{selectedUser && (
  <Modal
    title={`Edit User: ${selectedUser.username}`}
    visible={modalVisible}
    onCancel={handleModalClose}
    footer={[
      <Button key="close" onClick={handleModalClose}>
        Close
      </Button>,
      <Button key="save" type="primary" onClick={handleSaveChanges}>
        Save Changes
      </Button>,
    ]}
  >
    <div className={styles.modalField}>
      <label htmlFor="editedUsername">Username:</label>
      <Input
        id="editedUsername"
        value={editedUsername}
        onChange={(e) => setEditedUsername(e.target.value)}
      />
    </div>
    <div className={styles.modalField}>
      <label htmlFor="editedEmail">Email:</label>
      <Input
        id="editedEmail"
        value={editedEmail}
        onChange={(e) => setEditedEmail(e.target.value)}
      />
    </div>
    <div className={styles.switchContainer}>
      <label htmlFor="editedIsAdmin">isAdmin:</label>
      <div className={styles.switchField}>
        <Switch
          id="editedIsAdmin"
          checked={editedIsAdmin}
          onChange={(checked) => setEditedIsAdmin(checked)}
        />
      </div>
    </div>
  </Modal>
)}


    </div>
  );
};

export default TestPage;
