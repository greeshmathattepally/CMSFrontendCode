import { useEffect, useState } from 'react';
import Modal from 'react-modal'

interface Props{
    setVisible: any,
    visibleState:boolean,
    faqsData:any,
    setFaqsData:any,
    formDetails:any,
    setFormDetails:any,
    isUpdate:any,
    setIsUpdate:any
}
function FaqForm(props:Props){
    interface FaqFormDataType{
        id:string,
        question:string,
        description:string
    }
    const url = "http://localhost:8080/faq/addFaq";
    const [data, setData] = useState<FaqFormDataType>({
        id:"",
        question:"",
        description:""
    })
    const [errors, setErrors] = useState({
      question: "",
      description: ""
    });
    function validateForm() {
      let isValid = true;
      const newErrors = {
        question: "",
        description: ""
      };
    
      // Validate question
      if (data.question.trim() === "") {
        newErrors.question = "Question is required";
        isValid = false;
      }
    
      // Validate description
      if (data.description.trim() === "") {
        newErrors.description = "Description is required";
        isValid = false;
      }
    
      setErrors(newErrors);
      return isValid;
    }
    useEffect(() => {
        // Prepopulate the form with existing data when editing
        if (props.formDetails.id !== "") {
          setData({
            id:props.formDetails.id,
            question: props.formDetails.question,
            description: props.formDetails.description,
          });
        }
      }, [props.formDetails.id]);

    function handle(e:any)
    {       
         const newData = { ...data };
        // props.formDetails[e.target.id]=e.target.value;
        // newData[e.target.id as keyof FaqFormDataType] = e.target.value;
        // props.setFormDetails(props.formDetails)
        // setData(newData); 

        newData[e.target.id as keyof FaqFormDataType] = e.target.value;
    
        props.setFormDetails(newData)
        setData(newData);
    }

    function submit(e:any)
    {
       e.preventDefault();  
       if (!validateForm()) {
        return;
      }
       props.setVisible(false);
       const faqData = {
        question: data.question,
        description: data.description
       };
       console.log(JSON.stringify(faqData)); 
       fetch(url, {
        method:'post',
        headers:
        {
            'Access-Control-Allow-Origin':'*',
            'Content-Type':'application/json; charset=utf-8',
            'Data-Type':'json'
        },
        
        body:JSON.stringify(faqData)
        }).then(response=>{
            if(response.ok){
                setData({
                    id:"",
                    question:"",
                    description:""
                })
              return response.json();
            }
            else{
                setData({
                    id:"",
                    question:"",
                    description:""
                })
              throw new Error("Failed to post Faq data")
            }
          }).then(json=>{
            const newFaqTypedData = json as unknown as FaqFormDataType;
            //adding the newly added faq data to oldFaqsData which became accsessible with props, so when this change happenings, parent component will re-render and new data will be visible after submit
            if(props.formDetails.id=="")
            {
              props.setFaqsData(props.faqsData.concat(newFaqTypedData))
            }
            else
            {
                  fetch(`http://localhost:8080/faq/delete/${props.formDetails.id}`, {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    })
                  .then(response => {
                    if (response.ok) {
                      return response.json();
                    } else {
                      console.error(`Failed to delete card with ID`);
                    }
                  }).then(json1=>{
                    
                    const delHelpArticleTypedData = json1 as unknown as FaqFormDataType;
                    const updatedData = props.faqsData.map(
                      (helpArticleData: FaqFormDataType) =>
                        helpArticleData.id === delHelpArticleTypedData.id? newFaqTypedData : helpArticleData
                    );
                    console.log("updated array after delkete")
                    console.log(updatedData)
                    props.setFaqsData(updatedData);
                   
                  })
          }
            

          })
          props.setFormDetails({
            id: "",
            question: "",
            description: ""
          });
          setData({
            id:"",
            question:"",
            description:""
          });
    }
    return (
            <div>
                <Modal isOpen={props.visibleState} onRequestClose={()=>{
                  props.setVisible(false)
                  setData({
                    id:"",
                    question:"",
                    description:""
                });
                setErrors({
                  question:"",
                    description:""
                })
                props.setFormDetails({
                id: "",
                question:"",
                description:""
                })
                props.setIsUpdate(false)
                }
                } style={{
                    overlay:{
                        background:"rgba(0,0,0,0.8)"
                    },
                    content:{
                        maxWidth: "400px",
                        width:"100%",
                        position:"fixed",
                        top:"40%",
                        left:"50%",
                        transform:"translate(-50%, -50%)",
                        background:"lightgray",
                        maxHeight:"450px",
                        height:"100%"
                    }
                }}>
                <div>
                {props.isUpdate ? (
                    <h4 className="addFaq">Update Faq</h4>
                ) : (
                    <h4 className="addFaq">Add Faq</h4>
                )}
                </div>

                {/* <h4 className="addFaq">{props.isUpdate}?Add faq:UpdateFaq</h4> */}
                <button type="button" onClick={()=>{
                    props.setVisible(false) 
                    setData({
                        id:"",
                        question:"",
                        description:""
                    });
                    setErrors({
                      question:"",
                        description:""
                    })
                    props.setFormDetails({
                    id: "",
                    question:"",
                    description:""
                    })
                    props.setIsUpdate(false)
                }

                
          } style={
                    {
                        position: "fixed",
                        top:"8px",
                        right:"8px",
                        border:"none",
                        paddingBottom:"4px",
                        paddingLeft:"12px",
                        paddingRight:"12px",
                        fontSize:"20px",
                        fontWeight:"600"
                    }
                }>x</button>
                <br/>
                <form onSubmit={e=>{submit(e)
                                 props.setIsUpdate(false)} } className="form">
                    <label className="label">Question</label>
                    <br/>
                    <textarea onChange={e=>handle(e)} id="question" name="question" value={data.question} className="formQuestion"/>
                    {errors.question && <span className="error">{errors.question}</span>}
                    <br/>
                    <br/>
                    <label className="label">Description</label>
                    <br/>
                    <textarea onChange={e=>handle(e)} id="description" name="question" value={data.description}  className="formDescription"/>
                    {errors.description && <span className="error">{errors.description}</span>}
                    <br/>
                    <button type="submit" className="buttonSubmit" >{props.isUpdate ? (
                    <div>Update</div>
                ) : (
                    <div >Submit</div>
                )}</button>
                </form>
            </Modal>
        </div>
    )
}

export default FaqForm;