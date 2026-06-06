import API from "./api"

export const createGoal = async (msId: number, data: { title: string; desc: string; deadline: string }) => {
  const res = await API.post(`/mentor/${msId}/goal`, data)
  return res.data
}

export const getGoals = async (ms_id: number) => {
  const res = await API.get(`/mentor/${ms_id}/goals`)
  return res.data
}

export const addCheckpoint = async (g_id: number, text: string) => {
  const res = await API.post(`/mentor/goal/${g_id}/checkpoint`, { text })
  return res.data
}

export const toggleCheckpoint = async (g_id: number, cp_id: number, is_done: boolean) => {
  const res = await API.patch(`/mentor/goal/${g_id}/checkpoint/${cp_id}`, { is_done })
  return res.data
}

export const deleteCheckpoint = async (g_id: number, cp_id: number) => {
  const res = await API.delete(`/mentor/goal/${g_id}/checkpoint/${cp_id}`)
  return res.data
}
