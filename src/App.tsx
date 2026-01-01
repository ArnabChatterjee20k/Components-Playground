import Tree from './Tree'
export const bulkyTree = [
  {
    name: "Db1",
    children: [
      {
        name: "Db1.Schema1",
        children: [
          {
            name: "Db1.Schema1.Table1",
            children: [
              { name: "Column1", children: [] },
              { name: "Column2", children: [] },
              { name: "Column3", children: [] },
            ],
          },
          {
            name: "Db1.Schema1.Table2",
            children: [
              { name: "Column1", children: [] },
              { name: "Column2", children: [] },
            ],
          },
        ],
      },
      {
        name: "Db1.Schema2",
        children: [
          {
            name: "Db1.Schema2.Table1",
            children: [
              { name: "Column1", children: [] },
              { name: "Column2", children: [] },
              { name: "Column3", children: [] },
              { name: "Column4", children: [] },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Db2",
    children: [
      {
        name: "Db2.Schema1",
        children: Array.from({ length: 10 }).map((_, i) => ({
          name: `Db2.Schema1.Table${i + 1}`,
          children: Array.from({ length: 5 }).map((_, j) => ({
            name: `Column${j + 1}`,
            children: [],
          })),
        })),
      },
    ],
  },
  {
    name: "Db3",
    children: Array.from({ length: 5 }).map((_, i) => ({
      name: `Db3.Schema${i + 1}`,
      children: Array.from({ length: 8 }).map((_, j) => ({
        name: `Db3.Schema${i + 1}.Table${j + 1}`,
        children: [],
      })),
    })),
  },
]
export default function App() {
  return (
    <div className='container py-4 mx-auto w-40'>
      <Tree nodes={[{name:"root",children:bulkyTree}]}/>
    </div>
  )
}
