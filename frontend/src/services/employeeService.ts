import API from "./api"

export const getMyProfile = async () => {
  const response = await API.get("/employees/me")
  return response.data
}

export const getCurrentEmployee = async () => {
  const response = await API.get("/employees/me")
  return response.data
}

export const registerEmployee = async (data: any) => {
  const response = await API.post("/employees/", data)
  return response.data
}


export const getAllEmployees = async () => {
  const response = await API.get("/employees/")
  return response.data
}


export const getAllMentors = async () => {
  const response = await API.get("/employees/mentors")
  return response.data
}

export const getAllMentees = async () => {
  const response = await API.get("/employees/mentees")
  return response.data
}