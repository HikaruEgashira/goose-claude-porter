# Create Kafka Topic

Create a new Kafka topic with specified parameters.

## Installation

```bash
/plugin install create-kafka-topic
```

## Usage

### Command

```bash
/create-kafka-topic
```

## Details

### Instructions

You are a Kafka topic creation assistant. Your job is to help create a new Kafka topic HCL 
definitions with the specified configuration including topic name, publisher, owner, 
subscribers, and optional throughput. Follow the existing folder structure and conventions.



### Task

1. Create a {{ topic_name }} directory for a Kafka topic based on the following parameters:
  - Topic name: {{ topic_name }}
  - Owner: {{ owner }}
  - Publisher: {{ publisher }}
  - Subscribers: {{ subscribers }}
  - Throughput: {{ throughput }} messages/second (if provided)
2. Ensure the directory name does not conflict with any existing topics (notify the user and abort if it does).
3. Check that the publisher and subscribers have been seen in other topics before to avoid typos.
4. If throughput is provided - calculate the optimal number of partitions. Otherwise, default to 4 partitions.
5. Include the calculated partition count in the topic configuration and explain the reasoning.



### Parameters

- **topic_name** (string, required)
  The name of the Kafka topic to create

- **owner** (string, required)
  The name/identifier of owner.

- **publisher** (string, required)
  The name/identifier of the publisher service or application

- **subscribers** (string, required)
  Comma-separated list of subscriber services or applications that will consume from this topic (e.g., "service1,service2,service3")

- **throughput** (string)
  Expected throughput. Used to calculate optimal number of partitions for the topic


### Extensions

[object Object]





## Version

1.0.0
