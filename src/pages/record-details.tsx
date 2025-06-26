import DynamicForm from "@/components/home/DynamicForm";

const RecordDetails = () => {
  const structuredData = localStorage.getItem("structuredData") || "{}";

  return (
    <div>
      <h1>Record Details</h1>
      <DynamicForm structuredData={structuredData} />
    </div>
  );
};

export default RecordDetails;
