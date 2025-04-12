
import { useState } from 'react';
import { Patient, Medication } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Pill, Clock, Calendar, Trash2 } from 'lucide-react';
import TextToSpeechButton from './TextToSpeechButton';

interface MedicationReminderProps {
  patient: Patient;
  onUpdate: (updatedPatient: Patient) => void;
}

const MedicationReminder = ({ patient, onUpdate }: MedicationReminderProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    frequency: 'daily',
    time: '09:00',
    startDate: new Date().toISOString().split('T')[0],
  });
  const { toast } = useToast();

  const medications = patient.medications || [];

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const medication: Medication = {
      id: Date.now().toString(),
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency || 'daily',
      time: newMedication.time || '09:00',
      startDate: newMedication.startDate || new Date().toISOString().split('T')[0],
      endDate: newMedication.endDate,
    };

    const updatedPatient = {
      ...patient,
      medications: [...medications, medication],
    };

    onUpdate(updatedPatient);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: 'daily',
      time: '09:00',
      startDate: new Date().toISOString().split('T')[0],
    });
    setShowAddForm(false);

    toast({
      title: "Medication added",
      description: "Your medication reminder has been set",
    });
  };

  const handleDeleteMedication = (id: string) => {
    const updatedPatient = {
      ...patient,
      medications: medications.filter(med => med.id !== id),
    };

    onUpdate(updatedPatient);

    toast({
      title: "Medication removed",
      description: "The medication has been removed from your reminders",
    });
  };

  const generateReminderText = (medication: Medication) => {
    return `Remember to take ${medication.name}, ${medication.dosage} ${medication.frequency} at ${medication.time}.`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewMedication(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-healthcare-500" />
          <span>Medication Reminders</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {medications.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.map((medication) => (
                  <TableRow key={medication.id}>
                    <TableCell className="font-medium">{medication.name}</TableCell>
                    <TableCell>{medication.dosage}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1 text-sm">
                          <Clock size={14} />
                          {medication.time}, {medication.frequency}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar size={14} />
                          From {new Date(medication.startDate).toLocaleDateString()}
                          {medication.endDate && ` to ${new Date(medication.endDate).toLocaleDateString()}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TextToSpeechButton 
                          text={generateReminderText(medication)} 
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMedication(medication.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No medication reminders set. Add your first one below.
          </div>
        )}

        {showAddForm ? (
          <div className="mt-6 border rounded-md p-4 bg-gray-50">
            <h3 className="font-medium mb-4">Add New Medication</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newMedication.name}
                  onChange={handleInputChange}
                  placeholder="Enter medication name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  name="dosage"
                  value={newMedication.dosage}
                  onChange={handleInputChange}
                  placeholder="e.g., 10mg, 1 tablet"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={newMedication.frequency}
                  onValueChange={(value) => handleSelectChange('frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="twice daily">Twice Daily</SelectItem>
                    <SelectItem value="every morning">Every Morning</SelectItem>
                    <SelectItem value="every night">Every Night</SelectItem>
                    <SelectItem value="as needed">As Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={newMedication.time}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={newMedication.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={newMedication.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMedication}>
                Add Medication
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowAddForm(true)}
            className="mt-4 bg-healthcare-500 hover:bg-healthcare-600 w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Medication Reminder
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationReminder;
