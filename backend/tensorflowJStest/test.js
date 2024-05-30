const tf = require('@tensorflow/tfjs');

// Fake user-item interaction matrix (5x5)
const userItemMatrix = [
  [5, 3, 0, 1, 4],  // User 0
  [4, 0, 4, 3, 2],  // User 1
  [1, 1, 0, 5, 0],  // User 2
  [0, 3, 4, 0, 1],  // User 3
  [5, 4, 2, 2, 3]   // User 4
];

// Prepare data for training
const userIds = [];
const itemIds = [];
const ratings = [];

for (let user = 0; user < userItemMatrix.length; user++) {
  for (let item = 0; item < userItemMatrix[user].length; item++) {
    if (userItemMatrix[user][item] > 0) {
      userIds.push(user);
      itemIds.push(item);
      ratings.push(userItemMatrix[user][item]);
    }
  }
}

// Number of users and items
const numUsers = 5;
const numItems = 5;

// Latent factors
const numLatentFactors = 3;

// Create user and item embeddings
const userEmbedding = tf.variable(tf.randomNormal([numUsers, numLatentFactors]));
const itemEmbedding = tf.variable(tf.randomNormal([numItems, numLatentFactors]));

// Function to look up embeddings
function embeddingLookup(embedding, indices) {
  return tf.gather(embedding, indices);
}

// Placeholder for user and item IDs
const userId = tf.input({shape: [1], dtype: 'int32'});
const itemId = tf.input({shape: [1], dtype: 'int32'});

// Look up the embeddings using gather
const userEmbeddingLookup = tf.layers.lambda({func: x => embeddingLookup(userEmbedding, x)}).apply(userId);
const itemEmbeddingLookup = tf.layers.lambda({func: x => embeddingLookup(itemEmbedding, x)}).apply(itemId);

// Compute the dot product
const dotProduct = tf.layers.dot({axes: 1}).apply([userEmbeddingLookup, itemEmbeddingLookup]);

// Build and compile the model
const model = tf.model({
    inputs: [userId, itemId],
    outputs: dotProduct
});
model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError'
});

// Train the model
const userIdsTensor = tf.tensor1d(userIds, 'int32');
const itemIdsTensor = tf.tensor1d(itemIds, 'int32');
const ratingsTensor = tf.tensor1d(ratings, 'float32');

model.fit([userIdsTensor, itemIdsTensor], ratingsTensor, {
    epochs: 50,
    batchSize: 5
}).then(() => {
    // Make a prediction
    const userIdToPredict = 0; // example user ID
    const itemIdToPredict = 2; // example item ID

    const prediction = model.predict([tf.tensor1d([userIdToPredict], 'int32'), tf.tensor1d([itemIdToPredict], 'int32')]);
    prediction.print();
});
