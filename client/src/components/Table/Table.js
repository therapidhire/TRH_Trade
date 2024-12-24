// import React from "react";
// import { Table, Button } from "react-bootstrap";
// import { useDispatch } from "react-redux";
// import { sortStocks } from "../../redux/slices/stocksSlice";

// const TableComponent = ({ columns, columnKeys, data, buyButtonType, sellButtonType, onButtonClick }) => {
//   const dispatch = useDispatch();

//   const handleSort = (key) => {
//     dispatch(sortStocks({ key }));
//   };

//   console.log("data in table", data)

//   return (
//     <Table striped bordered hover responsive>
//       <thead>
//         <tr>
//           {columns.map((column, index) => (
//             <th
//               key={index}
//               onClick={() => handleSort(columnKeys[index])}
//               style={{ cursor: "pointer" }}
//             >
//               {column}
//             </th>
//           ))}
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//       {data.map((item, index) => (
//             <tr key={item.id}>
//               {columnKeys.map((key, idx) => (
//                 <td key={idx}>{item[key]}</td>
//               ))}
//               <td>
//                 <button
//                   className="btn btn-primary me-2"
//                   onClick={() => onButtonClick(item, buyButtonType)}
//                 >
//                   {buyButtonType}
//                 </button>
//                 <button
//                   className="btn"
//                   style={{
//                     "background-color": "#f57300",
//                     "fontWeight":"bold",
//                     "color":"white"
//                   }}
//                   onClick={() => onButtonClick(item, sellButtonType)}
//                 >
//                   {sellButtonType}
//                 </button>
//               </td>
//             </tr>
//           ))}
//       </tbody>
//     </Table>
//   );
// };

// export default TableComponent;
<<<<<<< HEAD
=======


// // import React, { useEffect, useState } from "react";
// // import { Table } from "react-bootstrap";
// // import { useDispatch } from "react-redux";
// // import { sortStocks } from "../../redux/slices/stocksSlice";
// // import axios from "axios";

// // const TableComponent = ({ columns, columnKeys, data, buyButtonType, sellButtonType, onButtonClick }) => {
// //   const dispatch = useDispatch();
// //   const [quantities, setQuantities] = useState({}); // Store quantities by ISIN number

// //   const handleSort = (key) => {
// //     dispatch(sortStocks({ key }));
// //   };

// //   // Fetch stock quantities based on ISIN numbers
// //   useEffect(() => {
// //     const fetchQuantities = async () => {
// //       try {
// //         const quantitiesMap = {};

//         // for (const item of data) {
//         //   try {
//         //     const response = await axios.get(`http://localhost:8080/api/stock/getStockByisinNum/${item.isinNumber}`);

//         //     console.log("response success", response.data.success);
//         //     quantitiesMap[item.stockName] = response.data?.data?.stockQty || 0; // Use optional chaining and default to 0
//         //   } catch (error) {
//         //     console.error(`Error fetching quantity for ${item.stockName}:`, error);
//         //     quantitiesMap[item.stockName] = 0; // Default to 0 if API call fails
//         //   }
//         // }

// //         setQuantities(quantitiesMap); // Update state with the fetched quantities
// //       } catch (error) {
// //         console.error("Error fetching stock quantities:", error);
// //       }
// //     };

// //     fetchQuantities();
// //   }, [data]);

// //   return (
// //     <Table striped bordered hover responsive>
// //       <thead>
// //         <tr>
// //           {columns.map((column, index) => (
// //             <th
// //               key={index}
// //               onClick={() => handleSort(columnKeys[index])}
// //               style={{ cursor: "pointer" }}
// //             >
// //               {column}
// //             </th>
// //           ))}
// //           <th>Actions</th>
// //         </tr>
// //       </thead>
// //       <tbody>
// //         {data.map((item, index) => (
// //           <tr key={item.id}>
// //             {columnKeys.map((key, idx) => (
// //               <td key={idx}>{item[key]}</td>
// //             ))}
// //             <td>
// //               <button
// //                 className="btn btn-primary me-2"
// //                 onClick={() => onButtonClick(item, buyButtonType)}
// //               >
// //                 {buyButtonType}
// //               </button>
// //               <button
// //                 className="btn"
// //                 style={{
// //                   backgroundColor: "#f57300",
// //                   fontWeight: "bold",
// //                   color: "white",
// //                 }}
// //                 disabled={quantities[item.stockName] === 0} // Disable button if quantity is 0
// //                 onClick={() => onButtonClick(item, sellButtonType)}
// //               >
// //                 {sellButtonType}
// //               </button>
// //             </td>
// //           </tr>
// //         ))}
// //       </tbody>
// //     </Table>
// //   );
// // };

// // export default TableComponent;

>>>>>>> 09a184939353169bffaadfb2a6670fe417392756
