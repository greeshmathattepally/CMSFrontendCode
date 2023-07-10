import { useEffect, useState } from "react";
import Modal from "react-modal";
interface Props {
  setVisible: any;
  visibleState: boolean;
  helpArticlesData: any;
  setHelpArticlesData: any;
  formDetails: any;
  setFormDetails: any;
  isUpdate: any;
  setIsUpdate: any;
}
function HelpArticleForm(props: Props) {
  interface HelpArticleDataType {
    id: any;
    title: string;
    subtitle: string;
    imageFile: any;
    altText: string;
    imageURL: string;
    paragraph: string;
  }
  const url = "http://localhost:8080/helpArticle/addHelpArticle2";
  const [data, setData] = useState<HelpArticleDataType>({
    id: "",
    title: "",
    subtitle: "",
    imageFile: null,
    altText: "",
    imageURL: "",
    paragraph: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    subtitle: "",
    imageFile: "",
    altText: "",
    paragraph: "",
  });
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Validate title
    if (data.title.trim() === "") {
      newErrors.title = "Title is required";
      valid = false;
    } else {
      newErrors.title = "";
    }

    // Validate subtitle
    if (data.subtitle.trim() === "") {
      newErrors.subtitle = "Subtitle is required";
      valid = false;
    } else {
      newErrors.subtitle = "";
    }

    // Validate imageFile
    if (!data.imageFile) {
      newErrors.imageFile = "Image is required";
      valid = false;
    } else {
      newErrors.imageFile = "";
    }

    // Validate altText
    if (data.altText.trim() === "") {
      newErrors.altText = "Alt Text is required";
      valid = false;
    } else {
      newErrors.altText = "";
    }

    // Validate paragraph
    if (data.paragraph.trim() === "") {
      newErrors.paragraph = "Paragraph is required";
      valid = false;
    } else {
      newErrors.paragraph = "";
    }

    setErrors(newErrors);
    return valid;
  };

  useEffect(() => {
    if (props.formDetails.id !== "") {
      setData({
        id: props.formDetails.id,
        title: props.formDetails.title,
        subtitle: props.formDetails.subtitle,
        imageFile: "",
        altText: props.formDetails.altText,
        imageURL: props.formDetails.imageURL,
        paragraph: props.formDetails.paragraph,
      });
    }
  }, [props.formDetails.id]);

  function handle(e: any) {
    const newData = { ...data };
    if (e.target.id == "imageFile") {
      const inputElement = e.target as HTMLInputElement | null;
      if (inputElement) {
        const selectedFile = inputElement.files?.[0];
        //newData[e.target.id as keyof HelpArticleDataType] = selectedFile;
        newData.imageFile = selectedFile;
        if (selectedFile) {
          newData["imageURL"] = selectedFile.name;
        }
      }
    } else if (e.target.id != "imageFile") {
      newData[e.target.id as keyof HelpArticleDataType] = e.target.value;
    }
    validateForm();
    props.setFormDetails(newData);
    setData(newData);
  }

  function submit(e: any) {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    if (props.formDetails.id != "") {
      console.log("edit on submit");
    } else {
      console.log("new entry on submit");
    }
    props.setVisible(false);
    const helArticleData: { [key: string]: string | File } = {
      title: props.formDetails.title,
      subtitle: props.formDetails.subtitle,
      imageFile: props.formDetails.imageFile,
      altText: props.formDetails.altText,
      imageURL: props.formDetails.imageURL,
      paragraph: props.formDetails.paragraph,
    };

    const title = helArticleData.title;
    const formData = new FormData();
    formData.append("title", helArticleData.title);
    formData.append("subtitle", helArticleData.subtitle);
    formData.append("imageFile", data.imageFile); // new Blob([new Uint8Array(helArticleData[imageFile])], {type: file.type } );// helArticleData.imageFile);
    formData.append("altText", helArticleData.altText);
    formData.append("imageURL", helArticleData.imageURL);
    formData.append("paragraph", helArticleData.paragraph);

    console.log(data.imageFile);
    fetch(url, {
      method: "post",
      body: formData,
    })
      .then((response) => {
        //console.log(response.json())
        if (response.ok) {
          return response.json();
        } else {
          setData({
            id: "",
            title: "",
            subtitle: "",
            imageFile: null,
            altText: "",
            imageURL: "",
            paragraph: "",
          });
          console.log(response);
          //throw new Error("Failed to post Faq data")
        }
      })
      .then((json) => {
        const newFaqTypedData = json as unknown as HelpArticleDataType;

        if (props.formDetails.id == "") {
          const updatedData1 = [...props.helpArticlesData, newFaqTypedData];
          props.setHelpArticlesData(updatedData1);
        } else {
          if (props.formDetails.id != "") {
            //delete with post request
            fetch(
              `http://localhost:8080/helpArticle/deleteHelpArticleWithImage/${props.formDetails.id}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else {
                  console.error(`Failed to delete card with ID`);
                }
              })
              .then((json1) => {
                const delHelpArticleTypedData =
                  json1 as unknown as HelpArticleDataType;
                const updatedData = props.helpArticlesData.map(
                  (helpArticleData: HelpArticleDataType) =>
                    helpArticleData.id === delHelpArticleTypedData.id
                      ? newFaqTypedData
                      : helpArticleData
                );
                console.log("updated array after delkete");
                console.log(updatedData);
                props.setHelpArticlesData(updatedData);
              });
          }
        }

        setData({
          id: "",
          title: "",
          subtitle: "",
          imageFile: null,
          altText: "",
          imageURL: "",
          paragraph: "",
        });
        props.setFormDetails({
          id: "",
          title: "",
          subtitle: "",
          imageFile: null,
          altText: "",
          imageURL: "",
          paragraph: "",
        });
      });
  }

  return (
    <div>
      <Modal
        isOpen={props.visibleState}
        onRequestClose={() => {
          props.setVisible(false);
          setData({
            id: 0,
            title: "",
            subtitle: "",
            imageFile: "",
            altText: "",
            imageURL: "",
            paragraph: "",
          });
          setErrors({
            title: "",
            subtitle: "",
            imageFile: "",
            altText: "",
            paragraph: "",
          });
          props.setFormDetails({
            id: 0,
            title: "",
            subtitle: "",
            imageFile: "",
            altText: "",
            imageURL: "",
            paragraph: "",
          });
          props.setIsUpdate(false);
        }}
        style={{
          overlay: {
            background: "rgba(0,0,0,0.8)",
          },
          content: {
            maxWidth: "400px",
            width: "100%",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "lightgray",
            maxHeight: "760px",
            height: "100%",
          },
        }}
      >
        <div>
          {props.isUpdate ? (
            <h4 className="addFaq">Update Help article</h4>
          ) : (
            <h4 className="addFaq">Add Help article</h4>
          )}
        </div>
        <button
          onClick={() => {
            props.setVisible(false);
            setData({
              id: 0,
              title: "",
              subtitle: "",
              imageFile: "",
              altText: "",
              imageURL: "",
              paragraph: "",
            });
            setErrors({
              title: "",
              subtitle: "",
              imageFile: "",
              altText: "",
              paragraph: "",
            });
            props.setFormDetails({
              id: 0,
              title: "",
              subtitle: "",
              imageFile: "",
              altText: "",
              imageURL: "",
              paragraph: "",
            });
            props.setIsUpdate(false);
          }}
          style={{
            position: "fixed",
            top: "8px",
            right: "8px",
            border: "none",
            paddingBottom: "4px",
            paddingLeft: "12px",
            paddingRight: "12px",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          x
        </button>
        <br />
        <form
          encType="multipart/form-data"
          onSubmit={(e) => submit(e)}
          className="form"
        >
          <label className="label">Title</label>
          <br />
          <textarea
            value={data.title}
            onChange={(e) => handle(e)}
            id="title"
            name="fname"
            className="formQuestion"
          />

          <br />
          {errors.title && <span className="error">{errors.title}</span>}
          <br />
          <label className="label">Subtitle</label>
          <br />
          <textarea
            value={data.subtitle}
            onChange={(e) => handle(e)}
            id="subtitle"
            name="fname"
            className="formQuestion"
          />
          {errors.subtitle && <span className="error">{errors.subtitle}</span>}
          <br />
          <br />
          <label className="label">Image upload</label>
          <br />
          <input
            accept="image/*"
            type="file"
            onChange={(e) => handle(e)}
            id="imageFile"
          ></input>
          {errors.imageFile && (
            <span className="error">{errors.imageFile}</span>
          )}
          <br />
          <br />
          <label className="label">Alt Text</label>
          <br />
          <textarea
            onChange={(e) => handle(e)}
            value={data.altText}
            id="altText"
          ></textarea>

          <br />
          {errors.altText && <span className="error">{errors.altText}</span>}
          <br />
          <label className="label">Paragraph</label>
          <br />
          <textarea
            value={data.paragraph}
            onChange={(e) => handle(e)}
            id="paragraph"
            name="lname"
            className="formDescription"
          />
          {errors.paragraph && (
            <span className="error">{errors.paragraph}</span>
          )}
          <br />
          <button type="submit" className="buttonSubmit">
            {props.isUpdate ? <div>Update</div> : <div>Submit</div>}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default HelpArticleForm;

/*import { useEffect, useState } from "react";
import Modal from "react-modal";
interface Props {
  setVisible: any;
  visibleState: boolean;
  helpArticlesData: any;
  setHelpArticlesData: any;
  formDetails:any,
  setFormDetails:any,
  isUpdate:any,
  setIsUpdate:any
}
function HelpArticleForm(props: Props) {
  interface HelpArticleDataType {
    id:any;
    title: string;
    subtitle: string;
    imageFile: any;
    altText: string;
    imageURL: string;
    paragraph: string;
  }
  const url = "http://localhost:8080/helpArticle/addHelpArticle2";
  const [data, setData] = useState<HelpArticleDataType>({
    id:"",
    title: "",
    subtitle: "",
    imageFile: null,
    altText: "",
    imageURL: "",
    paragraph: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    subtitle: "",
    imageFile: "",
    altText: "",
    paragraph: "",
  });
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
  
    // Validate title
    if (data.title.trim() === "") {
      newErrors.title = "Title is required";
      valid = false;
    } else {
      newErrors.title = "";
    }
  
    // Validate subtitle
    if (data.subtitle.trim() === "") {
      newErrors.subtitle = "Subtitle is required";
      valid = false;
    } else {
      newErrors.subtitle = "";
    }
  
    // Validate imageFile
    if (!data.imageFile) {
      newErrors.imageFile = "Image is required";
      valid = false;
    } else {
      newErrors.imageFile = "";
    }
  
    // Validate altText
    if (data.altText.trim() === "") {
      newErrors.altText = "Alt Text is required";
      valid = false;
    } else {
      newErrors.altText = "";
    }
  
    // Validate paragraph
    if (data.paragraph.trim() === "") {
      newErrors.paragraph = "Paragraph is required";
      valid = false;
    } else {
      newErrors.paragraph = "";
    }
  
    setErrors(newErrors);
    return valid;
  };
  
  useEffect(() => {
    if (props.formDetails.id !== '') {
          setData({
            id:props.formDetails.id,
            title: props.formDetails.title,
            subtitle: props.formDetails.subtitle,
            imageFile: "",
            altText: props.formDetails.altText,
            imageURL: props.formDetails.imageURL,
            paragraph: props.formDetails.paragraph,
          });
       }
      }, [props.formDetails.id]);


  function handle(e: any) {
    const newData = { ...data };
    if (e.target.id == "imageFile") {
      const inputElement = e.target as HTMLInputElement | null;
      if (inputElement) {
        const selectedFile = inputElement.files?.[0];
       //newData[e.target.id as keyof HelpArticleDataType] = selectedFile;
       newData.imageFile=selectedFile;
        if (selectedFile) {
          newData["imageURL"] = selectedFile.name;
        }
      }
      
    } 
    else if (e.target.id != "imageFile")
    {
        newData[e.target.id as keyof HelpArticleDataType] = e.target.value;
    }
    validateForm();
    props.setFormDetails(newData)
    setData(newData);
  }

  function submit(e: any) {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    if(props.formDetails.id!="")
    {
      console.log("edit on submit")
    }
    else{
      console.log("new entry on submit")
    }
    props.setVisible(false);
    const helArticleData: { [key: string]: string | File } = {
      title: props.formDetails.title,
      subtitle: props.formDetails.subtitle,
      imageFile: props.formDetails.imageFile,
      altText: props.formDetails.altText,
      imageURL: props.formDetails.imageURL,
      paragraph: props.formDetails.paragraph,
    };

    const title = helArticleData.title;
    const formData = new FormData();
    formData.append("title", helArticleData.title);
    formData.append("subtitle", helArticleData.subtitle);
    formData.append("imageFile", data.imageFile); // new Blob([new Uint8Array(helArticleData[imageFile])], {type: file.type } );// helArticleData.imageFile);
    formData.append("altText", helArticleData.altText);
    formData.append("imageURL", helArticleData.imageURL);
    formData.append("paragraph", helArticleData.paragraph);

    console.log(data.imageFile);
    fetch(url, {
      method: "post",
      body: formData,
    })
      .then((response) => {
        //console.log(response.json())
        if (response.ok) {
          return response.json();
        } else {
          setData({
            id:"",
            title: "",
            subtitle: "",
            imageFile: null,
            altText: "",
            imageURL: "",
            paragraph: "",
          });
          console.log(response);
          //throw new Error("Failed to post Faq data")
        }
      })
      .then((json) => {
        const newFaqTypedData = json as unknown as HelpArticleDataType;

        if(props.formDetails.id=="")
        {
          const updatedData1 = [...props.helpArticlesData, newFaqTypedData];
          props.setHelpArticlesData(updatedData1);
        }
        else{ 
          if(props.formDetails.id!=""){
            //delete with post request
            fetch(`http://localhost:8080/helpArticle/deleteHelpArticleWithImage/${props.formDetails.id}`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
                  .then(response => {
                    if (response.ok) {
                      //console.error('deleted while edit');
                      // const newHelpArticleTypedData = response.json() as unknown as HelpArticleDataType;
                      // const updatedData = props.helpArticlesData.filter((helpArticlesData: HelpArticleDataType) => helpArticlesData.id !== props.formDetails.id);
                      // props.setHelpArticlesData(
                      //   updatedData
                      // );
                      return response.json();
                    } else {
                      console.error(`Failed to delete card with ID`);
                    }
                  }).then(json1=>{
                    
                    const delHelpArticleTypedData = json1 as unknown as HelpArticleDataType;
                    const updatedData = props.helpArticlesData.map(
                      (helpArticleData: HelpArticleDataType) =>
                        helpArticleData.id === delHelpArticleTypedData.id? newFaqTypedData : helpArticleData
                    );
                    console.log("updated array after delkete")
                    console.log(updatedData)
                    props.setHelpArticlesData(updatedData);
                   
                  })
          }

        }

       
        
        setData({
          id:"",
          title: "",
          subtitle: "",
          imageFile: null,
          altText: "",
          imageURL: "",
          paragraph: "",
        });
        props.setFormDetails({
          id:"",
          title: "",
          subtitle: "",
          imageFile: null,
          altText: "",
          imageURL: "",
          paragraph: "",
        })
      });
  }

  return (
    <div>
      <Modal
        isOpen={props.visibleState}
        onRequestClose={() => {
          props.setVisible(false)
          setData({
            id:0,
            title: "",
            subtitle: "",
            imageFile: "",
            altText: "",
            imageURL: "",
            paragraph: "",
          })
          setErrors({
            title: "",
            subtitle: "",
            imageFile: "",
            altText: "",
            paragraph: "",
          })
          props.setFormDetails({
            id:0,
            title: "",
            subtitle: "",
            imageFile: "",
            altText: "",
            imageURL: "",
            paragraph: "",
            })
            props.setIsUpdate(false)
        }}
        style={{
          overlay: {
            background: "rgba(0,0,0,0.8)",
          },
          content: {
            maxWidth: "400px",
            width: "100%",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "lightgray",
            maxHeight: "760px",
            height: "100%",
          },
        }}
      >
        <div>
                {props.isUpdate ? (
                    <h4 className="addFaq">Update Help article</h4>
                ) : (
                    <h4 className="addFaq">Add Help article</h4>
                )}
        </div>
        <button 
          onClick={() => {props.setVisible(false)
            setData({
              id:0,
              title: "",
              subtitle: "",
              imageFile: "",
              altText: "",
              imageURL: "",
              paragraph: "",
            })
            setErrors({
              title: "",
              subtitle: "",
              imageFile: "",
              altText: "",
              paragraph: "",
            })
            props.setFormDetails({
              id:0,
              title: "",
              subtitle: "",
              imageFile: "",
              altText: "",
              imageURL: "",
              paragraph: "",
              })
              props.setIsUpdate(false)
          }}
          style={{
            position: "fixed",
            top: "8px",
            right: "8px",
            border: "none",
            paddingBottom: "4px",
            paddingLeft: "12px",
            paddingRight: "12px",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          x
        </button>
        <br />
        <form
          encType="multipart/form-data"
          onSubmit={(e) => submit(e)}
          className="form"
        >
          <label className="label">Title</label>
          <br />
          <textarea value={data.title}
            onChange={(e) => handle(e)}
            id="title"
            name="fname"
            className="formQuestion"
          />
          
          <br />
          {errors.title && <span className="error">{errors.title}</span>}
          <br />
          <label className="label">Subtitle</label>
          <br />
          <textarea value={data.subtitle}
            onChange={(e) => handle(e)}
            id="subtitle"
            name="fname"
            className="formQuestion"
          />
          {errors.subtitle && <span className="error">{errors.subtitle}</span>}
          <br />
          <br />
          <label className="label">Image upload</label>
          <br />
          <input 

            accept="image/*"
            type="file"
            onChange={(e) => handle(e)}
            id="imageFile"
          ></input>
          {errors.imageFile && <span className="error">{errors.imageFile}</span>}
          <br />
          <br />
          <label className="label">Alt Text</label>
          <br />
          <textarea onChange={(e) => handle(e) } value={data.altText} id="altText"></textarea>
          
          <br />
          {errors.altText && <span className="error">{errors.altText}</span>}
          <br />
          <label className="label">Paragraph</label>
          <br />
          <textarea value={data.paragraph}
            onChange={(e) => handle(e)}
            id="paragraph"
            name="lname"
            className="formDescription"
          />
          {errors.paragraph && <span className="error">{errors.paragraph}</span>}
          <br />
          <button type="submit" className="buttonSubmit">
          {props.isUpdate ? (
                    <div>Update</div>
                ) : (
                    <div >Submit</div>
                )}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default HelpArticleForm;
*/