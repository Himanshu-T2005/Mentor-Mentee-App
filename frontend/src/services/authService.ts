import API from "./api"

export const loginInit = async (email: string, password: string) => {
  const params = new URLSearchParams()
  params.append("username", email)
  params.append("password", password)
  const res = await API.post("/auth/login/init", params)
  return res.data
}

export const loginComplete = async (email: string, role: string) => {
  const res = await API.post("/auth/login/complete", { email, role })
  return res.data
}

export const enrollUser = async (
  email: string,
  password: string,
  isMentor: boolean,
  skillId: number
) => {
  const params = new URLSearchParams()
  params.append("username", email)
  params.append("password", password)
  const res = await API.post(`/auth/enroll?role=${isMentor}&skill_id=${skillId}`, params)
  return res.data
}
