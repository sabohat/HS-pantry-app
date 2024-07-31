
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { firestore } from "@/firebase"; // Ensure you have configured Firebase and exported 'firestore'
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs, query, where } from "firebase/firestore";


export function PantryPage ({ pantryList }) {
  const [items, setItems] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    notes: "",
  })

  useEffect(() => {
    setItems(pantryList)
  }, [pantryList])

  const handleAddItem = async () => {
    try {
      const docRef = await addDoc(collection(firestore, "pantry"), newItem);
      setItems([...items, { ...newItem, id: docRef.id }]);
      setNewItem({ name: "", quantity: 1, notes: "" });
      setIsModalOpen(false);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const handleRemoveItem = (itemId) => {
    setItemToDelete(items.find((item) => item.id === itemId));
    setIsDeleteConfirmationOpen(true);
  }

  const confirmRemoveItem = async () => {
    try {
      await deleteDoc(doc(firestore, "pantry", itemToDelete.id));
      setItems(items.filter((item) => item.id !== itemToDelete.id));
      setIsDeleteConfirmationOpen(false);
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  }

  const handleDecreaseQuantity = async (itemId) => {
    const item = items.find((item) => item.id === itemId);
    if (item.quantity > 1) {
      try {
        const updatedItem = { ...item, quantity: item.quantity - 1 };
        await updateDoc(doc(firestore, "pantry", itemId), { quantity: updatedItem.quantity });
        setItems(items.map((i) => (i.id === itemId ? updatedItem : i)));
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    }
  }

  const handleIncreaseQuantity = async (itemId) => {
    const item = items.find((item) => item.id === itemId);
    try {
      const updatedItem = { ...item, quantity: item.quantity + 1 };
      await updateDoc(doc(firestore, "pantry", itemId), { quantity: updatedItem.quantity });
      setItems(items.map((i) => (i.id === itemId ? updatedItem : i)));
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }
  return (
    (<div className="container mx-auto py-8 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">My Pantry</h1>
        <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
          Add Item
        </Button>
      </header>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span>Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDecreaseQuantity(item.id)}
                    disabled={item.quantity <= 1}>
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleIncreaseQuantity(item.id)}>
                    +
                  </Button>
                </div>
              </div>
              {item.notes && (
                <div className="mt-2">
                  <span>Notes:</span>
                  <p>{item.notes}</p>
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <Button variant="destructive" size="sm" onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Item to Pantry</DialogTitle>
          </DialogHeader>
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddItem()
              }}
              className="grid gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  required />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Item</Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isDeleteConfirmationOpen}
        onOpenChange={setIsDeleteConfirmationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
          </DialogHeader>
          <div>
            <p>Are you sure you want to remove &quot;{itemToDelete?.name}&quot;?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemoveItem}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>)
  );
}
