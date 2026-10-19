import Schedule from '../components/Schedule.jsx'
import { PageHeader } from '../components/ui.jsx'

export default function Maintenance() {
  return (
    <div>
      <PageHeader eyebrow="Técnicos de laboratorio" title="Tareas de mantenimiento" />
      <Schedule />
    </div>
  )
}
