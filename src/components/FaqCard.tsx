
interface FaqCardProps{
    id:any,
    question: string,
    description: string,
    onDelete:any,
    onEdit:any,
    visibleState:any,
    setVisible:any,
    isUpdate:any,
    setIsUpdate:any
}

function FaqCard(faq:FaqCardProps){
    const handleDelete = () => {
        faq.onDelete(faq.id);
      };
      const handleEdit = () => {
        faq.setVisible(true)
        faq.onEdit(faq.id);
        faq.setIsUpdate(true)
       };
    return ( <div  className="faq-card">
       
        <div className="question">
            <h4>{faq.question}</h4>
           
        </div>
        <p className="description">{faq.description}</p>
        <button onClick={handleEdit} className="buttonCard">Edit</button>
        <button onClick={handleDelete} className="buttonCard">Delete</button>
      </div>);
}

export default FaqCard