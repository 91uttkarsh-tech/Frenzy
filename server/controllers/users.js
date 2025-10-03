import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getNearbyFriends = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userLocation = user.location;

    let nearby_users = await User.find({
      _id: { $ne: id },
      location: { $regex: userLocation, $options: "i" },
    });

    nearby_users = nearby_users.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(nearby_users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    if (id === friendId) {
      return res.status(400).json({ message: "You cannot add yourself as a friend" });
    }

    const [user, friend] = await Promise.all([
      User.findById(id),
      User.findById(friendId),
    ]);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    const isFriend = user.friends.includes(friendId);

    if (isFriend) {
      user.friends = user.friends.filter(fId => fId.toString() !== friendId);
      friend.friends = friend.friends.filter(fId => fId.toString() !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    // save both in parallel
    await Promise.all([user.save(), friend.save()]);

    // fetch all user's friends at once
    const friends = await User.find({ _id: { $in: user.friends } })
      .select("_id firstName lastName occupation location picturePath");

    res.status(200).json(friends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

