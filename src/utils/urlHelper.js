const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://backend.cappsule.co.in/api/v1/';

export const constructUrl = (searchKeyword, pharmacyIds) =>{
    return `${BASE_URL}new_search?q=${searchKeyword}&pharmacyIds=${pharmacyIds}`
}
// https://backend.cappsule.co.in/api/v1/new_search?q=paracetamol&pharmacyIds=1,2,3
