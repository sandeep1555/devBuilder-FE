import { BASE_URL } from "../Constants/Constants";
import apiClient from "../Contexts/authInterceptor";


export const getOrgsanisationDetail = async () => {
    const response = await apiClient.get("organisation/detail/");
    return response;
}


export const editOrganisationDetails = async (organisationId, name, logo, address1, city, state, country, zip) => {
    const response = await apiClient.put(BASE_URL + "organisation/update/" + organisationId, { name: name, organisation_type: 1, address1: address1, logo:logo, city: city, state: state, country: country, zip: zip });
    return response;
}