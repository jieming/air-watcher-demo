import { render, screen } from "@testing-library/react"
import WatchCityList from "./WatchCityList"
import type { WatchCity } from "./watch-list-types"

describe("WatchCityList", () => {
  it("should render the heading", () => {
    render(<WatchCityList cities={[]} />)
    const heading = screen.getByRole("heading", { name: /watch cities/i })
    expect(heading).toBeInTheDocument()
  })

  it("should render empty state when no cities are provided", () => {
    render(<WatchCityList cities={[]} />)
    expect(screen.getByText("No watch cities found")).toBeInTheDocument()
  })

  it("should render a single city", () => {
    const cities: WatchCity[] = [{ id: "1", name: "London", filterWear: 100 }]
    render(<WatchCityList cities={cities} />)

    expect(screen.getByText("London")).toBeInTheDocument()
    expect(screen.getByText("Filter Wear: 100")).toBeInTheDocument()
  })

  it("should render multiple cities", () => {
    const cities: WatchCity[] = [
      { id: "1", name: "London", filterWear: 100 },
      { id: "2", name: "Paris", filterWear: 250 },
      { id: "3", name: "Berlin", filterWear: 50 },
      { id: "4", name: "Madrid", filterWear: 0 },
    ]
    render(<WatchCityList cities={cities} />)

    expect(screen.getByText("London")).toBeInTheDocument()
    expect(screen.getByText("Filter Wear: 100")).toBeInTheDocument()
    expect(screen.getByText("Paris")).toBeInTheDocument()
    expect(screen.getByText("Filter Wear: 250")).toBeInTheDocument()
    expect(screen.getByText("Berlin")).toBeInTheDocument()
    expect(screen.getByText("Filter Wear: 50")).toBeInTheDocument()
    expect(screen.getByText("Madrid")).toBeInTheDocument()
    expect(screen.getByText("Filter Wear: 0")).toBeInTheDocument()
  })
})
