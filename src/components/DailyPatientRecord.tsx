
import { useState } from 'react';
import { Doctor, DailyPatientRecord as DailyRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, PlusCircle, Users, ClipboardList, BarChart3, Clipboard } from 'lucide-react';
import { format, parse, isValid, subDays } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface DailyPatientRecordProps {
  doctor: Doctor;
  onUpdate: (updatedDoctor: Doctor) => void;
}

const DailyPatientRecordComponent = ({ doctor, onUpdate }: DailyPatientRecordProps) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState(today);
  const [showAddForm, setShowAddForm] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const { toast } = useToast();

  // Get or create daily record for the selected date
  const dailyRecords = doctor.dailyPatientRecords || [];
  const currentRecord = dailyRecords.find(record => record.date === selectedDate) || {
    date: selectedDate,
    patientCount: 0,
    patients: []
  };

  // Get records for the past 7 days for chart
  const getLastWeekRecords = () => {
    const today = new Date();
    const result = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      const record = dailyRecords.find(rec => rec.date === date);
      result.push({
        date: format(subDays(today, i), 'dd/MM'),
        count: record ? record.patientCount : 0
      });
    }
    
    return result;
  };

  const weeklyData = getLastWeekRecords();

  const handleAddPatient = () => {
    if (!patientName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter patient name",
        variant: "destructive",
      });
      return;
    }

    // Create a new patient entry
    const newPatient = {
      id: Date.now().toString(),
      name: patientName,
      notes: patientNotes || undefined
    };

    // Find if there's already a record for this date
    const existingRecordIndex = dailyRecords.findIndex(record => record.date === selectedDate);
    let updatedRecords;

    if (existingRecordIndex >= 0) {
      // Update existing record
      const updatedRecord = {
        ...dailyRecords[existingRecordIndex],
        patientCount: dailyRecords[existingRecordIndex].patientCount + 1,
        patients: [...dailyRecords[existingRecordIndex].patients, newPatient]
      };
      
      updatedRecords = [...dailyRecords];
      updatedRecords[existingRecordIndex] = updatedRecord;
    } else {
      // Create new record
      const newRecord: DailyRecord = {
        date: selectedDate,
        patientCount: 1,
        patients: [newPatient]
      };
      
      updatedRecords = [...dailyRecords, newRecord];
    }

    // Update doctor record
    const updatedDoctor = {
      ...doctor,
      dailyPatientRecords: updatedRecords
    };

    onUpdate(updatedDoctor);
    setPatientName('');
    setPatientNotes('');
    setShowAddForm(false);

    toast({
      title: "Patient added",
      description: "Patient has been added to your daily record"
    });
  };

  const handleDateChange = (date: string) => {
    if (isValid(parse(date, 'yyyy-MM-dd', new Date()))) {
      setSelectedDate(date);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-healthcare-500" />
          <span>Daily Patient Records</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Chart column */}
          <div className="border rounded-md p-4 bg-white shadow-sm">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-healthcare-500" />
              <span>Weekly Patient Count</span>
            </h3>
            <div className="h-40 flex items-end justify-between gap-1">
              {weeklyData.map((day, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-healthcare-200 rounded-t-sm" 
                       style={{ 
                         height: `${day.count > 0 ? (day.count * 10) + 20 : 0}px`,
                         minHeight: day.count > 0 ? '20px' : '0',
                         maxHeight: '120px'
                       }}>
                    {day.count > 0 && (
                      <div className="text-xs font-semibold text-center text-healthcare-800">
                        {day.count}
                      </div>
                    )}
                  </div>
                  <div className="text-xs mt-1 text-gray-600">{day.date}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-sm text-center text-gray-500">
              Total patients this week: {weeklyData.reduce((sum, day) => sum + day.count, 0)}
            </div>
          </div>
          
          {/* Daily record selector */}
          <div className="border rounded-md p-4 bg-white shadow-sm">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-healthcare-500" />
              <span>Select Date</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  max={today}
                />
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedDate(today)}
                  className="whitespace-nowrap"
                >
                  Today
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="text-healthcare-500" size={20} />
                <span className="font-medium">
                  {currentRecord.patientCount} patient{currentRecord.patientCount !== 1 ? 's' : ''} seen on {format(parse(selectedDate, 'yyyy-MM-dd', new Date()), 'dd MMM yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Patient list for selected date */}
        {currentRecord.patients.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecord.patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.notes || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border rounded-md">
            No patients recorded for this date.
          </div>
        )}

        {/* Add patient form */}
        {showAddForm ? (
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Clipboard className="h-4 w-4 text-healthcare-500" />
              <span>Add Patient to Record</span>
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientNotes">Consultation Notes (Optional)</Label>
                <Textarea
                  id="patientNotes"
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  placeholder="Enter consultation notes"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPatient}>
                  Add Patient
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => {
              setShowAddForm(true);
              // Reset to today when adding new record
              setSelectedDate(today);
            }}
            className="w-full bg-healthcare-500 hover:bg-healthcare-600"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Record New Patient
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyPatientRecordComponent;
