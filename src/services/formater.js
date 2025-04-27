const formatarData = (data) => {
    const date = new Date(data);
  
    const adjustedDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );
  
    const day = String(adjustedDate.getDate()).padStart(2, "0");
    const month = String(adjustedDate.getMonth() + 1).padStart(2, "0");
    const year = adjustedDate.getFullYear();
    const hours = String(adjustedDate.getHours()).padStart(2, "0");
    const minutes = String(adjustedDate.getMinutes()).padStart(2, "0");
  
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };


  const formatarDataDia = (data) => {
    const date = new Date(data);
  
    const adjustedDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );
  
    const day = String(adjustedDate.getDate()).padStart(2, "0");
    const month = String(adjustedDate.getMonth() + 1).padStart(2, "0");
    const year = adjustedDate.getFullYear();
    const hours = String(adjustedDate.getHours()).padStart(2, "0");
    const minutes = String(adjustedDate.getMinutes()).padStart(2, "0");
  
    return `${day}/${month}/${year}`;
  };
  
  const formatarHora = (data) => {
    const date = new Date(data);
  
    const adjustedDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );
  
    // const day = String(adjustedDate.getDate()).padStart(2, "0");
    // const month = String(adjustedDate.getMonth() + 1).padStart(2, "0");
    // const year = adjustedDate.getFullYear();
    const hours = String(adjustedDate.getHours()).padStart(2, "0");
    const minutes = String(adjustedDate.getMinutes()).padStart(2, "0");
  
    return `${hours}:${minutes}`;
  };


module.exports = {formatarData, formatarDataDia, formatarHora}