import API from "./api"

export const applyToBementor = async (skillId: number) => {
  const response = await API.post("/mentor/mapp", { skill_id: skillId })
  return response.data
}


export const getMentorApplications = async () => {
  const response = await API.get("/mentor/mapp/all")
  return response.data
}


export const approveMentorApplication = async (ma_id: number) => {
  const response = await API.post("/mentor/mapprov", { ma_id })
  return response.data
}


export const rejectMentorApplication = async (ma_id: number) => {
  const response = await API.post("/mentor/mapreject", { ma_id })
  return response.data
}


export const getMentorsBySkill = async (skillId: number) => {
  const response = await API.get(`/mentor/skills/${skillId}`)
  return response.data
}


export const sendMentorshipRequest = async (mentorId: number, skillId: number) => {
  const response = await API.post("/mentor/request", {
    mentor_id: mentorId,
    skill_id: skillId
  })
  return response.data
}


export const getMentorshipRequests = async () => {
  const response = await API.get("/mentor/getreqs")
  return response.data
}

export const acceptMenteeRequest = async (mr_id: number) => {
  const response = await API.post("/mentor/accept", { mr_id })
  return response.data
}


export const rejectMenteeRequest = async (mr_id: number) => {
  const response = await API.post("/mentor/reject", { mr_id })
  return response.data
}


export const getMyMentees = async () => {
  const response = await API.get("/mentor/getmentee")
  return response.data
}


export const getMyMentorships = async () => {
  const response = await API.get("/mentor/mymentorship")
  return response.data
}
export const getPhSkills = async () => {
  const response = await API.get("/mentor/ph/myskills")
  return response.data
}
