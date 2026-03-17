import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {

        axios.get("http://localhost:5000/orders")
            .then(res => {
                setOrders(res.data);
            });

    }, []);


    return (

        <div className="p-10">

            <h1 className="text-3xl mb-4">
                Admin Orders
            </h1>

            {orders.map(o => (

                <div
                    key={o.id}
                    className="border p-3 mb-2"
                >

                    Order ID: {o.id}
                    <br />
                    User: {o.username}
                    <br />
                    Total: ₹ {o.total}

                </div>

            ))}

        </div>

    );

}

export default Admin;