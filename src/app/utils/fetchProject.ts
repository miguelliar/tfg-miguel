export const onFileChange = async (
  selectedFile: any,
  setProyecto: any,
  setLoading: any
) => {
  try {
    setLoading(true)
    const response = await fetch("/api/proyecto/parseFile", {
      method: "POST",
      body: selectedFile,
    })
    const content = await response.json()
    setProyecto(content)
    setLoading(false)
  } catch (error) {
    console.error(error)
    setLoading(false)
  }
}
