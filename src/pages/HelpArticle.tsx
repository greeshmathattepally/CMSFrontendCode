import { useEffect, useState } from "react";
import HelpArticleForm from "../components/HelpArticleForm";
import HelpArticleCard from "../components/HelpArticleCard";

function HelpArticle() {
  const [visible, setVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  interface HelpArticleDataType {
    id: any;
    title: string;
    subtitle: string;
    imageFile: any;
    altText: string;
    imageUrl: string;
    paragraph: string;
  }

  const [formDetails, setFormDetails] = useState<HelpArticleDataType>({
    id: "",
    title: "",
    subtitle: "",
    imageFile: null,
    altText: "",
    imageUrl: "",
    paragraph: "",
  });
  const url = "http://localhost:8080/helpArticle/allHelpArticlesWithImages";
  const [data, setData] = useState<HelpArticleDataType[]>([]);
  useEffect(() => {
    fetch(url, {
      method: "get",
    })
      .then((response) => {
        //console.log(response.json())
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch Faqs data");
        }
      })
      .then((json) => {
        console.log("h");
        const typedData = json as unknown as HelpArticleDataType[];
        setData(typedData);
        //console.log(json.imageFile)
        //console.log(typedData[0].imageFile)
      });
  }, []);

  const handleDeleteCard = (id: any) => {
    fetch(
      `http://localhost:8080/helpArticle/deleteHelpArticleWithImage/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          const updatedData = data.filter(
            (helpArticle) => helpArticle.id !== id
          );
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
        <div>Help Articles</div>
        <button className="button" onClick={() => setVisible(true)}>
          + Create New Entry
        </button>
      </div>
      <HelpArticleForm
        visibleState={visible}
        setVisible={setVisible}
        helpArticlesData={data}
        setHelpArticlesData={setData}
        formDetails={formDetails}
        setFormDetails={setFormDetails}
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
      />
      <div>
        {data.map((helpArticle) => (
          <HelpArticleCard
            id={helpArticle.id}
            title={helpArticle.title}
            subtitle={helpArticle.subtitle}
            imageFile={helpArticle.imageFile}
            altText={helpArticle.altText}
            imageURL={helpArticle.imageUrl}
            paragraph={helpArticle.paragraph}
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
  );
}

export default HelpArticle;

/*import { useEffect, useState } from "react";
import HelpArticleForm from "../components/HelpArticleForm";
import HelpArticleCard from "../components/HelpArticleCard";

function HelpArticle(){
    const [visible, setVisible] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    interface HelpArticleDataType{
        id:any,
        title:string,
        subtitle:string,
        imageFile:any,
        altText:string,
        imageUrl:string,
        paragraph:string
      }

      const [formDetails, setFormDetails] = useState<HelpArticleDataType>(
        {
          id:"",
          title: "",
          subtitle: "",
          imageFile: null,
          altText: "",
          imageUrl: "",
          paragraph: "",
        }
      )
    const url = "http://localhost:8080/helpArticle/allHelpArticlesWithImages";
    const [data, setData] = useState<HelpArticleDataType[]>([]);
      useEffect(()=>{fetch(url, {   
        method:'get',
        }).then(response=>{
          //console.log(response.json())
          if(response.ok){
            return response.json();
          }
          else{
            throw new Error("Failed to fetch Faqs data")
          }
        }).then(json=>{
          console.log("h")
          const typedData = json as unknown as HelpArticleDataType[]
          setData(typedData)
          //console.log(json.imageFile)
          //console.log(typedData[0].imageFile)

        })},[])

        const handleDeleteCard = (id: any) => {
          fetch(`http://localhost:8080/helpArticle/deleteHelpArticleWithImage/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => {
              if (response.ok) {
                const updatedData = data.filter((helpArticle) => helpArticle.id !== id);
                setData(updatedData);
              } else {
                // Handle deletion error
                console.error(`Failed to delete card with ID ${id}.`);
              }
            })
            .catch(error => {
              // Handle network or fetch error
              console.error('Error occurred while deleting the card:', error);
            });
        };

        const handleEditCard = (id: any) => {
          const hy=data.find((data) => data.id === id);
          if(hy)
            setFormDetails(hy);
          console.log("editing")
        };

    return (
        <div>
            <div className="subHeader">
                <div>
                    Help Articles
                </div>
                <button className="button" onClick={()=>setVisible(true)}>
                    + Create New Entry
                </button>
            </div>
                <HelpArticleForm visibleState={visible} setVisible={setVisible} helpArticlesData={data} setHelpArticlesData={setData} formDetails={formDetails} setFormDetails={setFormDetails} isUpdate={isUpdate} setIsUpdate={setIsUpdate} />
            <div>
            
          {data.map((helpArticle)=>(
            <HelpArticleCard id={helpArticle.id} title={helpArticle.title} subtitle={helpArticle.subtitle} imageFile={helpArticle.imageFile} altText={helpArticle.altText} imageURL={helpArticle.imageUrl} paragraph={helpArticle.paragraph} onDelete={handleDeleteCard}   onEdit={handleEditCard}  visibleState={visible} setVisible={setVisible} isUpdate={isUpdate} setIsUpdate={setIsUpdate}   />
          ))}
        
            </div>
        </div>
    );
}

export default HelpArticle;

*/
