import requests
import json

API_BASE = "https://8001-iqz7c9y30uyzsqfu0iarv.e2b.app/api"

def test_todo_api():
    print("🧪 Testing Todo API...")
    
    # Test 1: Get all todos (should be empty initially)
    print("\n1. Getting all todos...")
    response = requests.get(f"{API_BASE}/todos")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test 2: Create a new todo
    print("\n2. Creating a new todo...")
    new_todo = {
        "title": "Learn FastAPI",
        "description": "Build amazing APIs with Python"
    }
    response = requests.post(f"{API_BASE}/todos", json=new_todo)
    print(f"Status: {response.status_code}")
    created_todo = response.json()
    print(f"Created todo: {created_todo}")
    todo_id = created_todo["id"]
    
    # Test 3: Create another todo
    print("\n3. Creating another todo...")
    new_todo2 = {
        "title": "Build React App",
        "description": "Create a beautiful frontend"
    }
    response = requests.post(f"{API_BASE}/todos", json=new_todo2)
    print(f"Status: {response.status_code}")
    created_todo2 = response.json()
    print(f"Created todo: {created_todo2}")
    
    # Test 4: Get all todos (should have 2 now)
    print("\n4. Getting all todos again...")
    response = requests.get(f"{API_BASE}/todos")
    print(f"Status: {response.status_code}")
    all_todos = response.json()
    print(f"All todos: {len(all_todos)} todos found")
    for todo in all_todos:
        print(f"  - {todo['title']} (completed: {todo['completed']})")
    
    # Test 5: Update a todo (mark as completed)
    print(f"\n5. Marking todo {todo_id} as completed...")
    update_data = {"completed": True}
    response = requests.put(f"{API_BASE}/todos/{todo_id}", json=update_data)
    print(f"Status: {response.status_code}")
    updated_todo = response.json()
    print(f"Updated todo: {updated_todo['title']} - completed: {updated_todo['completed']}")
    
    # Test 6: Get a specific todo
    print(f"\n6. Getting specific todo {todo_id}...")
    response = requests.get(f"{API_BASE}/todos/{todo_id}")
    print(f"Status: {response.status_code}")
    print(f"Todo: {response.json()}")
    
    # Test 7: Delete a todo
    print(f"\n7. Deleting todo {todo_id}...")
    response = requests.delete(f"{API_BASE}/todos/{todo_id}")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test 8: Verify deletion
    print("\n8. Verifying deletion...")
    response = requests.get(f"{API_BASE}/todos")
    remaining_todos = response.json()
    print(f"Remaining todos: {len(remaining_todos)}")
    
    print("\n✅ Todo API testing completed!")

if __name__ == "__main__":
    try:
        test_todo_api()
    except Exception as e:
        print(f"❌ Error testing API: {e}")