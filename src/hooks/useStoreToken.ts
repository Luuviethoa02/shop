function useStoreToken() {
  const setToken = (accessToken: string, refreshToken: string): void => {
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
    return
  }

  const getToken = () => {
    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")
    return { accessToken, refreshToken }
  }

  const clearToken = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  }

  return { setToken, getToken, clearToken }
}

export default useStoreToken
