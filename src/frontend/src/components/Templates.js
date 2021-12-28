import React, { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useParams
} from 'react-router-dom';
import { getCookie } from "./CSRF"

export default function Templates(props) {

	function formatTemplate() {
		var title = document.getElementById('title').value
		var text = document.getElementById('templateInput').value
		var subject = document.getElementById('subjectInput').value

		if (!(title && text && subject)) {
			console.log('stopped')
			return
		}

		var variables = new Set()
		for (var i = 0; i < text.length; i++) {
			if (text.charAt(i) == '{') {
				var variable = '{'
				while (text.charAt(i) != '}') {
					i += 1
					if (i >= text.length) {
						break
					}
					variable += text.charAt(i)
				}
				variables.add(variable)
			}
		}
		for (variable of variables) {
			text = text.replaceAll(variable, variable.toUpperCase())
		}
		return ({ title, subject, text })
	}

	function setText(e) {
		var text = e.target.value
		var variables = new Set()
		for (var i = 0; i < text.length; i++) {
			if (text.charAt(i) == '{') {
				var variable = '{'
				while (text.charAt(i) != '}') {
					i += 1
					if (i >= text.length) {
						break
					}
					variable += text.charAt(i)
				}
				variables.add(variable)
			}
		}
		for (variable of variables) {
			var newVar = variable.substring(1, variable.length - 1)
			text = text.replaceAll(variable, "<span style='background-color: pink'>" + newVar.toUpperCase() + "</span>")
		}
		document.getElementById('display').innerHTML = text
	}

	function newTemplate() {

		function saveTemplate() {
			var { title, text } = formatTemplate()
			fetch("/userdata/addtemplate/", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `JWT ${localStorage.getItem('token')}`
				},
				body: JSON.stringify({ "title": title, 'template': text })
			})
				.then(response => response.json())
				.then(json => {
					window.location.href = '/templates/'
				})
		}

		return (
			<>
				<input type="text" id='title' placeholder="Title"></input>
				<br />
				<input type='text' id='subjectInput' placeholder="Subject Line"></input>
				<br />
				<textarea id='templateInput' style={{
					height: '200px',
					width: '200px'
				}} onChange={(e) => setText(e)}></textarea>

				<p id='display'></p>

				<button onClick={() => saveTemplate()}>Save Template</button>
			</>
		)
	}

	function Templates() {

		const [templateData, setTemplateData] = useState()

		useEffect(() => {
			fetch("/userdata/templates/", {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `JWT ${localStorage.getItem('token')}`
				}
			})
				.then(response => response.json())
				.then(json => setTemplateData(json))
		}, [])

		return (
			<>
				{templateData
					? templateData.map((element, key) => {
						return (
							<>
								<a href={'/templates/' + element.id} key={key}><b>{element.title}</b> -- {element.template}</a>
								<br />
							</>
						)
					})
					: null
				}
				<button onClick={() => window.location.href = '/templates/add'}>Add template</button>
			</>
		)
	}

	function EditTemplate() {

		function getTemplates(id) {
			fetch("/userdata/template/" + id + "/", {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `JWT ${localStorage.getItem('token')}`
				}
			})
				.then(response => response.json())
				.then(json => {
					if (json.title && json.template) {
						document.getElementById('title').value = json.title;
						document.getElementById('templateInput').value = json.template;
						document.getElementById('subjectInput').value = json.subject
					}
					else {
						window.location.href = '/404'
					}
				})
		}

		function saveTemplate(id) {
			var { title, subject, text } = formatTemplate()
			fetch("/userdata/template/edit/" + id + "/", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `JWT ${localStorage.getItem('token')}`,
					'X-CSRFToken': getCookie('csrftoken')
				},
				body: JSON.stringify({ "title": title, 'subject': subject, 'template': text })
			})
				.then(response => response.json())
				.then(json => console.log(json))
		}

		function deleteTemplate(id) {
			fetch("/userdata/template/delete/" + id + "/", {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `JWT ${localStorage.getItem('token')}`
				}
			})
				.then(response => response.json())
				.then(json => window.location.href = '/templates/')
		}

		var { id } = useParams();

		useEffect(() => {
			getTemplates(id)
		}, [])

		return (
			<>
				<input type="text" id='title' placeholder="Title"></input>
				<br />
				<input type='text' id='subjectInput' placeholder="Subject Line"></input>
				<br />
				<textarea id='templateInput' style={{
					height: '200px',
					width: '200px'
				}} onChange={(e) => setText(e)}></textarea>

				<p id='display'></p>

				<button onClick={() => saveTemplate(id)}>Save Template</button>
				<button onClick={() => deleteTemplate(id)}>Delete Template</button>
			</>
		)
	}

	return (
		<>
			<h1>Templates</h1>
			<Routes>
				<Route exact path='' element={<Templates />} />
				<Route exact path='add' element={newTemplate()} />
				<Route path=':id' element={<EditTemplate />} />
			</Routes>
		</>
	)
}
