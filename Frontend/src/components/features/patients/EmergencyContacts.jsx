import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Phone, Plus, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { patientData } from "../../../data/patient-data";

export function EmergencyContacts() {
  const [contacts, setContacts] = useState([
    patientData.profile.emergencyContact,
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    relationship: "",
    phone: "",
  });

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts((prev) => [...prev, { ...newContact, id: Date.now() }]);
      setNewContact({ name: "", relationship: "", phone: "" });
      setIsAdding(false);
    }
  };

  const handleRemoveContact = (index) => {
    setContacts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditContact = (index, field, value) => {
    setContacts((prev) =>
      prev.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-blue-600" />
          Emergency Contacts
        </CardTitle>
        <CardDescription>
          Add people to contact in case of medical emergencies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Contacts */}
        {contacts.map((contact, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{contact.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {contact.relationship}
                </p>
              </div>
              {contacts.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveContact(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`name-${index}`}>Name</Label>
                <Input
                  id={`name-${index}`}
                  value={contact.name}
                  onChange={(e) =>
                    handleEditContact(index, "name", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor={`relationship-${index}`}>Relationship</Label>
                <Input
                  id={`relationship-${index}`}
                  value={contact.relationship}
                  onChange={(e) =>
                    handleEditContact(index, "relationship", e.target.value)
                  }
                  placeholder="e.g., Spouse, Parent, Sibling"
                />
              </div>
              <div>
                <Label htmlFor={`phone-${index}`}>Phone Number</Label>
                <Input
                  id={`phone-${index}`}
                  value={contact.phone}
                  onChange={(e) =>
                    handleEditContact(index, "phone", e.target.value)
                  }
                  type="tel"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>Emergency contact #{index + 1}</span>
            </div>
          </div>
        ))}

        {/* Add New Contact Form */}
        {isAdding && (
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
            <h3 className="font-semibold mb-3">Add New Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="new-name">Name</Label>
                <Input
                  id="new-name"
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label htmlFor="new-relationship">Relationship</Label>
                <Input
                  id="new-relationship"
                  value={newContact.relationship}
                  onChange={(e) =>
                    setNewContact((prev) => ({
                      ...prev,
                      relationship: e.target.value,
                    }))
                  }
                  placeholder="e.g., Spouse, Parent"
                />
              </div>
              <div>
                <Label htmlFor="new-phone">Phone Number</Label>
                <Input
                  id="new-phone"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  type="tel"
                  placeholder="+880 XXX XXX XXXX"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddContact}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Add Contact Button */}
        {!isAdding && contacts.length < 3 && (
          <Button
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Emergency Contact
          </Button>
        )}

        {/* Save Button */}
        <div className="pt-4 border-t">
          <Button className="w-full">Save Emergency Contacts</Button>
        </div>

        {/* Emergency Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">
            <strong>Important:</strong> Make sure your emergency contacts are
            aware they are listed and have consented to be contacted in case of
            medical emergencies.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
