import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at?: string;
};

export default function App() {
  const [task, setTask] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);

  // ✅ TOP TOAST STATE
  const [toast, setToast] = useState<{
    message: string;
    visible: boolean;
  }>({
    message: '',
    visible: false,
  });

  useEffect(() => {
    loadTasks();
  }, []);

  // ✅ CUSTOM TOP TOAST
  function notify(message: string) {
    setToast({
      message,
      visible: true,
    });

    setTimeout(() => {
      setToast({
        message: '',
        visible: false,
      });
    }, 2000);
  }

  // ✅ LOAD TASKS
  async function loadTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      notify('Failed to load tasks');
      console.log(error.message);
      return;
    }

    setTasks((data as Task[]) || []);
  }

  // ✅ ADD TASK
  async function addTask() {
    if (!task.trim()) {
      notify('Please enter a task');
      return;
    }

    const { error } = await supabase.from('tasks').insert([
      {
        title: task.trim(),
        completed: false,
      },
    ]);

    if (error) {
      notify('Failed to add task');
      return;
    }

    setTask('');
    notify('Task added');
    loadTasks();
  }

  // ✅ TOGGLE TASK
  async function toggleTask(item: Task) {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !item.completed })
      .eq('id', item.id);

    if (error) {
      notify('Update failed');
      return;
    }

    notify(item.completed ? 'Marked as pending' : 'Task completed');
    loadTasks();
  }

  // ✅ DELETE TASK
  async function deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      notify('Delete failed');
      return;
    }

    notify('Task deleted');
    loadTasks();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TaskFlow</Text>

      {/* CAMERA */}
<TouchableOpacity
  style={styles.cameraButton}
  onPress={() => router.push('/camera')}
>
  <MaterialIcons
    name="camera-alt"
    size={20}
    color="#fff"
  />

  <Text style={styles.cameraText}>
    Open Camera
  </Text>
</TouchableOpacity>

      {/* 🔥 TOP TOAST UI */}
      {toast.visible && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}
      

      {/* INPUT */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter Task"
          value={task}
          onChangeText={setTask}
        />

        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskRow}
            onPress={() => toggleTask(item)}
            onLongPress={() => deleteTask(item.id)}
          >
            <MaterialIcons
              name={
                item.completed
                  ? 'check-box'
                  : 'check-box-outline-blank'
              }
              size={22}
              color={item.completed ? '#2eba61' : '#666'}
            />

            <Text
              style={[
                styles.taskText,
                item.completed && styles.completedText,
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet</Text>
        }
      />
    </View>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },

  addButton: {
    backgroundColor: '#58ba2e',
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  taskText: {
    fontSize: 16,
    marginLeft: 10,
  },

  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },

  // 🔥 TOAST STYLE (BIG + TOP)
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#2eba61',
    padding: 15,
    borderRadius: 10,
    zIndex: 999,
    elevation: 10,
    alignItems: 'center',
  },

  toastText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  cameraButton: {
  backgroundColor: '#2E5BBA',
  padding: 12,
  borderRadius: 10,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 15,
},

cameraText: {
  color: '#fff',
  marginLeft: 8,
  fontWeight: 'bold',
},

});