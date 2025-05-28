import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function NewPollPage() {
  const [title, setTitle] = useState("")
  const [options, setOptions] = useState(["", ""]) // мінімум 2 варіанти
  const navigate = useNavigate()

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = () => setOptions([...options, ""])
  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const filteredOptions = options.filter(opt => opt.trim() !== "")
    if (title.trim() === "" || filteredOptions.length < 2) {
      alert("Введіть заголовок і мінімум 2 варіанти відповіді.")
      return
    }

    try {
      const res = await axios.post("http://localhost:3000/api/v1/polls", {
        title,
        options: filteredOptions
      })
      navigate(`/polls/${res.data.id}`)
    } catch (error: any) {
    console.error("Помилка при створенні:", error.response?.data || error.message);
    alert("Помилка створення голосування: " + (error.response?.data?.error || error.message));
  }}

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Нове голосування</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Заголовок голосування"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {options.map((opt, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              className="border p-2 flex-1"
              placeholder={`Варіант ${i + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(i, e.target.value)}
            />
            {options.length > 2 && (
              <button type="button" onClick={() => removeOption(i)} className="text-red-500">✖</button>
            )}
          </div>
        ))}

        <button type="button" onClick={addOption} className="text-blue-500">
          ➕ Додати варіант
        </button>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Створити
        </button>
      </form>
    </div>
  )
}
