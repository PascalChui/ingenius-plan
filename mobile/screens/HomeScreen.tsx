"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Calendar, Clock, CheckSquare, AlertTriangle } from "lucide-react-native"
import { useAuth } from "../contexts/AuthContext"
import { API_URL } from "../config"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function HomeScreen() {
  const navigation = useNavigation()
  const { user } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    tasks: [],
    events: [],
    stats: {
      totalTasks: 0,
      completedTasks: 0,
      upcomingEvents: 0,
      urgentTasks: 0,
    },
  })

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch(`${API_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const onRefresh = () => {
    fetchDashboardData()
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Bonjour, {user?.name || "Utilisateur"}</Text>
          <Text style={styles.subheading}>Voici votre journée</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: "#e6f0ff" }]}>
              <CheckSquare size={20} color="#4a89f3" />
            </View>
            <Text style={styles.statValue}>
              {dashboardData.stats.completedTasks}/{dashboardData.stats.totalTasks}
            </Text>
            <Text style={styles.statLabel}>Tâches</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: "#fff0e6" }]}>
              <Calendar size={20} color="#f7a04b" />
            </View>
            <Text style={styles.statValue}>{dashboardData.stats.upcomingEvents}</Text>
            <Text style={styles.statLabel}>Événements</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: "#ffe6e6" }]}>
              <AlertTriangle size={20} color="#f25d52" />
            </View>
            <Text style={styles.statValue}>{dashboardData.stats.urgentTasks}</Text>
            <Text style={styles.statLabel}>Urgents</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tâches à faire</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Tasks")}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {dashboardData.tasks.length > 0 ? (
            dashboardData.tasks.slice(0, 3).map((task, index) => (
              <TouchableOpacity
                key={index}
                style={styles.taskItem}
                onPress={() => navigation.navigate("TaskDetail", { taskId: task.id })}
              >
                <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(task.priority) }]} />
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskMeta}>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Pas de date"}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                  <Text style={styles.statusText}>{getStatusLabel(task.status)}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>Aucune tâche à afficher</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Événements à venir</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Calendar")}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {dashboardData.events.length > 0 ? (
            dashboardData.events.slice(0, 3).map((event, index) => (
              <View key={index} style={styles.eventItem}>
                <View style={styles.eventTimeContainer}>
                  <Text style={styles.eventTime}>
                    {new Date(event.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                </View>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventMeta}>
                    <Clock size={12} color="#666" /> {formatDuration(event.startTime, event.endTime)}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Aucun événement à venir</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// Helper functions
const getPriorityColor = (priority) => {
  switch (priority?.toUpperCase()) {
    case "URGENT":
      return "#f25d52"
    case "HIGH":
      return "#f7a04b"
    case "MEDIUM":
      return "#4a89f3"
    case "LOW":
      return "#adb5bd"
    default:
      return "#adb5bd"
  }
}

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "TODO":
      return "#e9ecef"
    case "IN_PROGRESS":
      return "#e6f0ff"
    case "DONE":
      return "#e6f7f0"
    default:
      return "#e9ecef"
  }
}

const getStatusLabel = (status) => {
  switch (status?.toUpperCase()) {
    case "TODO":
      return "À faire"
    case "IN_PROGRESS":
      return "En cours"
    case "DONE":
      return "Terminé"
    default:
      return status
  }
}

const formatDuration = (start, end) => {
  if (!start || !end) return "Durée inconnue"

  const startDate = new Date(start)
  const endDate = new Date(end)
  const durationMs = endDate.getTime() - startDate.getTime()
  const hours = Math.floor(durationMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`
  }
  return `${minutes}min`
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subheading: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "30%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 16,
    marginTop: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAll: {
    fontSize: 14,
    color: "#4a89f3",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  priorityIndicator: {
    width: 4,
    height: "80%",
    borderRadius: 2,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  taskMeta: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  eventTimeContainer: {
    width: 60,
    marginRight: 12,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4a89f3",
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  eventMeta: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    padding: 16,
  },
})
