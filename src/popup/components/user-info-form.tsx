import React from "react"
import { useForm } from 'react-hook-form'

interface UserInfo {
  id: string
  password: string
}

interface FromComponentProps {
  onSubmit?: (info: UserInfo) => void,
  onCancel?: () => void
}

export const UserInfoFrom: React.FC<FromComponentProps> = ({ onSubmit, onCancel }) => {
  const defaultValues = {
    id: process.env?.ID ?? "",
    password: process.env?.PASSWORD ?? ""
  }

  const { register, handleSubmit } = useForm<UserInfo>({ defaultValues })

  return (
    <>
      <form onSubmit={handleSubmit((info) => {
        onSubmit?.(info)
      })}>
        <div style={{ margin: "0 0 8px 0" }}>
          <label style={{ display: 'block', marginBottom: 4 }}>UserID</label>
          <input className="tmp-input" type="text" id="id" {...register("id", {})} />
        </div>
        <div style={{ margin: "16px 0 8px 0" }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Password</label>
          <input className="tmp-input" type="password" {...register("password", {})} />
        </div>
        <div style={{ margin: "12px 0 8px 0" }}>
          <input
            className="tmp-btn tmp-submit-btn" style={{ marginRight: 8 }}
            type="submit" value="submit"
          />
          <input
            className="tmp-btn tmp-cancel-btn"
            type="button" value="cancel" onClick={onCancel}
          />
        </div>
      </form>
    </>
  )
}
