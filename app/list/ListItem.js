'use client'

import Link from "next/link"

export default function ListItem(props){
  let result = props.result
  return (
    <div>
      {
        result.map((item, index) => 
          <div className="list-item" key={item._id}>
            <Link href={'/detail/' + item._id} >
              <h4>{item.title}</h4>
            </Link>
            <Link href={'/edit/' + item._id}> ✏️ </Link>
            <p>{item.content}</p>
          </div>
        )
      }
    </div>
  )
}