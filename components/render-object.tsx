import React from "react"

import {
	capitalize,
	convertCamelToHuman,
	formatDate,
	isEmpty,
} from "@/lib/utils"

interface Props {
	title?: string
	obj: Record<string, any>
	excludeEmpty?: boolean
	className?: string
	style?: React.CSSProperties
	key?: string
	keys?: string[]
}

export default function RenderObject({
	title,
	obj,
	className,
	style,
	excludeEmpty = false,
	key,
	keys = Object.keys(obj || {}),
}: Props) {
	if (!obj) {
		return null
	}
	// 0x0bf1db3956f01921b65b1459884ce58429babcd82996f12dc7b147d7e5b696d6
	return (
		<div className={className} style={style} key={key}>
			{title && <div className="text-lg font-bold">{title}</div>}
			{obj &&
				keys.map((k, i) => {
					const val = obj[k]
					if (excludeEmpty && isEmpty(val)) {
						return null
					}

					if (Array.isArray(val)) {
						return (
							<div className="render-object-key" key={i}>
								{convertCamelToHuman(k)}: <b>{val.join(", ")}</b>
							</div>
						)
					} else if (typeof val === "boolean") {
						return (
							<div className="render-object-key" key={i}>
								{convertCamelToHuman(k)}: <b>{val ? "Yes" : "No"}</b>
							</div>
						)
					} else if (typeof val === "object") {
						return (
							<RenderObject
								key={i.toString()}
								obj={val}
								className={className}
							/>
						)
					} else if (typeof val === "string" && val.indexOf("+00:00") > -1) {
						return (
							<div className="render-object-key" key={i}>
								{convertCamelToHuman(k)}: <b>{val}</b>
							</div>
						)
					}

					return (
						<div className="render-object-key" key={i}>
							{convertCamelToHuman(k)}: <b>{val}</b>
						</div>
					)
				})}
		</div>
	)
}
