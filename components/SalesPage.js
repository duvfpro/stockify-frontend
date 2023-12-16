import styles from "../styles/SalesPage.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
// import LastSales from './LastSales';
import { Table } from "antd";
import stateService from "./stateService";

function SalesPage() {
  const router = useRouter();
  const user = useSelector((state) => state.user.value);
  // Récupération des produits à afficher en appelant getDisplayProducts de l'objet stateService
  const displayProducts = stateService.getDisplayProducts();

  useEffect(() => {
    if (!user.token) {
      router.push("/");
    }
  }, [user.token, router]);

  // Appel de la méthode getColumns de l'objet stateService pour récupérer la configuration des colonnes de tableau
  const columns = stateService.getColumns();

  const tableStyle = {
    backgroundColor: "#213F62",
    border: "2px solid #000",
  };

  return (
    <div className={styles.main}>
      <div className={styles.sales}>
        <Table
          dataSource={displayProducts} // assign dataSource les produit récuperer a afficher dans le tableau
          columns={columns} // assign a columns la configuration des colonnes au tableau 
          pagination={{ pageSize: 10 }}
          size="large"
          style={tableStyle}
          expandable={{
            expandedRowRender: (record) => (
              <ul>
                  {record.history.map((operationGroup, groupIndex) => (
                    <li key={groupIndex}>
                      {operationGroup.map((operation, operationIndex) => (
                        <p key={operationIndex}>
                          {operation.type && operation.quantity && operation.date
                            ? `${operation.type} ${operation.quantity} le ${operation.date}`
                            : "Invalid operation data"}
                        </p>
                      ))}
                    </li>
                  ))}
                </ul>
            ),
            rowExpandable: (record) => record.history.length > 0,
          }}
        />
      </div>
    </div>
  );
}

export default SalesPage;
