import { useState, useEffect } from "react";
import FaqForm from "../components/FaqForm";
import FaqCard from "../components/FaqCard";

function Faq() {
  const [visible, setVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  interface FaqListDataType {
    id: string;
    question: string;
    description: string;
  }
  const [formDetails, setFormDetails] = useState<FaqListDataType>({
    id: "",
    question: "",
    description: "",
  });
  const url = "http://localhost:8080/faq/allFaqs";
  const [data, setData] = useState<FaqListDataType[]>([]);
  useEffect(() => {
    fetch(url, {
      method: "get",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((response) => {
        console.log("f");
        //console.log(response.json())
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch Faqs data");
        }
      })
      .then((json) => {
        //console.log(json)
        const typedData = json as unknown as FaqListDataType[];
        setData(typedData);
      });
  }, []);

  const handleDeleteCard = (id: any) => {
    fetch(`http://localhost:8080/faq/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          const updatedData = data.filter((faq) => faq.id !== id);
          setData(updatedData);
        } else {
          // Handle deletion error
          console.error(`Failed to delete card with ID ${id}.`);
        }
      })
      .catch((error) => {
        // Handle network or fetch error
        console.error("Error occurred while deleting the card:", error);
      });
  };

  const handleEditCard = (id: any) => {
    const hy = data.find((data) => data.id === id);
    if (hy) setFormDetails(hy);
    console.log("editing");
  };

  return (
    <div>
      <div className="subHeader">
        <div>FAQs</div>
        <button className="button" onClick={() => setVisible(true)}>
          + Create New Entry
        </button>
      </div>
      <FaqForm
        visibleState={visible}
        setVisible={setVisible}
        faqsData={data}
        setFaqsData={setData}
        formDetails={formDetails}
        setFormDetails={setFormDetails}
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
      />
      <div>
        <div>
          {data.map((faq) => (
            <FaqCard
              id={faq.id}
              question={faq.question}
              description={faq.description}
              onDelete={handleDeleteCard}
              onEdit={handleEditCard}
              visibleState={visible}
              setVisible={setVisible}
              isUpdate={isUpdate}
              setIsUpdate={setIsUpdate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faq;
